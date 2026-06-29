import { DndContext, useSensor, useSensors, DragOverlay, PointerSensor, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useTreeContext } from "../contexts/TreeContext";
import NodeRenderer from "./NodeRenderer";
import { useState } from "react";
import type { TreeNode } from "../types";

export default function TreeView() {
    const { tree, loading } = useTreeContext()
    const [ activeId, setActiveId ] = useState<string | null>(null)

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: {distance: 8} } ))

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        setActiveId(String(active.id))
    }

    const handleDragEnd = (event: DragEndEvent) => {
        //const { active } = event
        setActiveId(null)            
    }

    const found = (nodes: TreeNode[], id: string): TreeNode | null => {
        for (const node of nodes) {
            if (node.id === id) return node
            const target = found(node.children, id)
            if (target !== null) return target
        }
        return null
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

    return (
        <DndContext sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        >
            <ul>
                <SortableContext items={tree.map(children => children.id)}>
                    {tree.map(node => (
                        <NodeRenderer key={node.id} node={node} />
                    ))}
                </SortableContext>
            </ul>
            <DragOverlay>
                {activeId ? (
                    <div className="cursor-grabbing rounded-lg bg-white shadow-2xl ring-1 ring-black/5 opacity-90">
                        <NodeRenderer node={found(tree, activeId)} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}