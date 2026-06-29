import { DndContext, useSensor, useSensors, DragOverlay, PointerSensor, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useTreeContext } from "../contexts/TreeContext";
import NodeRenderer from "./NodeRenderer";
import { useState } from "react";
import type { TreeNode } from "../types";

export default function TreeView() {
    const { tree, loading, reorderNodes, reorderSteps } = useTreeContext()
    const [ activeId, setActiveId ] = useState<string | null>(null)

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: {distance: 8} } ))

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        setActiveId(String(active.id))
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)            
        if (over === null || active.id === over.id) return
        const overId = String(over.id)
        const parent = foundParent(tree, activeId)
        const siblings = parent ? parent.children : tree
        const old = siblings.findIndex(n => n.id === activeId)
        const next = siblings.findIndex(n => n.id === overId)
        const ordered = arrayMove(siblings, old, next).map(n => n.id)
        if (parent !== foundParent(tree, overId)) return
        else if (!parent) {
            reorderNodes(null, {orderedIds: ordered})
        }
        else if (parent.nodetype === "phase") {
            reorderSteps(parent.id, {orderedIds: ordered})
        } else if (parent.nodetype === "task") {
            reorderNodes(parent.id, {orderedIds: ordered})
        }
    }

    const found = (nodes: TreeNode[], id: string): TreeNode | null => {
        for (const node of nodes) {
            if (node.id === id) return node
            const target = found(node.children, id)
            if (target !== null) return target
        }
        return null
    }

    const foundParent = (nodes: TreeNode[], id: string): TreeNode | null => {
        return found(nodes, found(nodes, id)?.parentId)
    }

    if (loading === true) return (
        <div>
            <p>Loading...</p>
        </div>
    )

    if (tree.length === 0) return (
        <div>
            <p>ノードがありません</p>
        </div>
    )

    // ゴーストは掴んだ1行だけ表示する（children を空にして配下サブツリーを描かない）
    const activeNode = activeId ? found(tree, activeId) : null

    return (
        <DndContext sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        >
            <SortableContext items={tree.map(children => children.id)}>
                <ul>
                    {tree.map(node => (
                        <NodeRenderer key={node.id} node={node} />
                    ))}
                </ul>
            </SortableContext>
            <DragOverlay dropAnimation={null}>
                {activeNode ? (
                    <div className="cursor-grabbing rounded-lg bg-white shadow-2xl ring-1 ring-black/5 opacity-90">
                        <NodeRenderer node={{ ...activeNode, children: [] }} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}