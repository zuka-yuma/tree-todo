export type Node = {
    id: string
    title: string
    userId: string
    parentId: string | null
    nodetype: NodeType
    status: Status
    priority: Priority
    deadline: Date | null
    sort: number
    step: number
    collapse: boolean
    createAt: Date
    updateAt: Date
    children: Node[]
}

export type User = {
    id: string
    email: string
    name: string
    createAt: Date
    updateAt: Date
}

type NodeType = "task" | "phase"

type Status = "todo" | "in_progress" | "done"

type Priority = "high" | "medium" | "low"