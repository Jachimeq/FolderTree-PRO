import React, { useState } from "react";
import { FileUp, FolderPlus, Download, Undo2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import create from "zustand";
import axios from "axios";

// Button component replacement
const Button = ({ variant, className, children, ...props }: any) => (
  <button
    className={`${variant === 'outline' ? 'border border-gray-300 hover:bg-gray-100' : 'bg-blue-500 text-white hover:bg-blue-600'} rounded-md px-4 py-2 text-sm font-medium ${className}`}
    {...props}
  >
    {children}
  </button>
);

interface TreeNode {
  id: string;
  children: string[];
  isExpanded: boolean;
  data: {
    title: string;
    tags: string[];
  };
}

interface Tree {
  rootId: string;
  items: {
    [key: string]: TreeNode;
  };
}

interface Store {
  tree: Tree;
  setTree: (tree: Tree) => void;
}

// Fixed Zustand store creation without extra parentheses
const useTreeStore = create<Store>((set) => ({
  tree: {
    rootId: "root",
    items: {
      root: {
        id: "root",
        children: [],
        isExpanded: true,
        data: { title: "Root", tags: [] },
      },
    },
  },
  setTree: (tree) => set({ tree }),
}));

// Fixed SortableItem props - added key property
interface SortableItemProps {
  id: string;
  title: string;
  onClick: () => void;
  selected: boolean;
  key?: string | number;
 // Add key property to fix the error
}

const SortableItem = ({ id, title, onClick, selected }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onClick={onClick}
      className={`cursor-pointer p-1 px-2 hover:bg-blue-50 rounded ${selected ? "bg-blue-100 text-blue-600" : ""}`}
    >
      📁 {title}
    </li>
  );
};

export default function FolderTreeUI() {
  const { tree, setTree } = useTreeStore();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      parseTreeFromText(text);
    };
    reader.readAsText(acceptedFiles[0]);
  };

  // Fixed dropzone with required event handlers
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/plain": [".txt"] },
    multiple: false,
    onDragEnter: () => {},
    onDragOver: () => {},
    onDragLeave: () => {},
  });

  function parseTreeFromText(text: string) {
    const lines = text.split("\n").filter((l) => l.trim() !== "");
    const newTree: Tree = {
      rootId: "root",
      items: {
        root: { id: "root", children: [], isExpanded: true, data: { title: "Root", tags: [] } },
      },
    };

    let idCounter = 1;
    const stack: string[] = ["root"];

    lines.forEach((line) => {
      const depth = line.search(/\S/);
      const name = line.trim();
      const parent = stack[depth];
      const id = `node-${idCounter++}`;

      newTree.items[id] = {
        id,
        children: [],
        isExpanded: true,
        data: { title: name, tags: [] },
      };

      newTree.items[parent].children.push(id);
      stack[depth + 1] = id;
    });

    setTree(newTree);
  }

  // Added event type
  const handleDragEnd = (event: { active: { id: string }; over: { id: string } | null }) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const parent = "root";
    const children = [...tree.items[parent].children];
    const oldIndex = children.indexOf(active.id);
    const newIndex = children.indexOf(over.id);

    const updatedTree = {
      ...tree,
      items: {
        ...tree.items,
        [parent]: {
          ...tree.items[parent],
          children: arrayMove(children, oldIndex, newIndex),
        },
      },
    };

    setTree(updatedTree);
  };

  const selected = selectedNode ? tree.items[selectedNode] : null;

  // Added response type
  const classifyNode = async () => {
    if (!selected) return;
    const response = await axios.post<{ category: string }>("/api/classify", { 
      title: selected.data.title 
    });
    const newTag = response.data.category || "Uncategorized";
    const updated = {
      ...tree,
      items: {
        ...tree.items,
        [selectedNode!]: {
          ...tree.items[selectedNode!],
          data: {
            ...tree.items[selectedNode!].data,
            tags: [...tree.items[selectedNode!].data.tags, newTag],
          },
        },
      },
    };
    setTree(updated);
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 border-r p-4 space-y-4">
        <h2 className="text-xl font-bold mb-4">FolderTree PRO</h2>
        <Button
  variant="outline"
  className="w-full justify-start"
  onClick={() => {
    const id = `node-${Date.now()}`;
    const newNode: TreeNode = {
      id,
      children: [],
      isExpanded: true,
      data: { title: "New Folder", tags: [] },
    };

    const updatedTree = {
      ...tree,
      items: {
        ...tree.items,
        [id]: newNode,
        root: {
          ...tree.items.root,
          children: [...tree.items.root.children, id],
        },
      },
    };

    setTree(updatedTree);
  }}
>
  <FolderPlus className="mr-2 h-4 w-4" /> Add Folder
</Button>

<Button
  variant="outline"
  className="w-full justify-start"
  onClick={() => {
    const children = [...tree.items.root.children];
    const lastId = children.pop();
    if (!lastId) return;

    const newItems = { ...tree.items };
    delete newItems[lastId];

    const updatedTree = {
      ...tree,
      items: {
        ...newItems,
        root: {
          ...tree.items.root,
          children,
        },
      },
    };

    setTree(updatedTree);
  }}
>
  <Undo2 className="mr-2 h-4 w-4" /> Undo
</Button>
<Button
  variant="outline"
  className="w-full justify-start"
  onClick={async () => {
    await axios.post('/api/create-folders', { tree });
    alert("Foldery zostały utworzone fizycznie na serwerze!");
  }}
>
  <FolderPlus className="mr-2 h-4 w-4" /> Create Physical Folders
</Button>


      </aside>

      <main className="flex-1 p-6 overflow-auto bg-white">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Your Folder Tree</h1>
          <p className="text-sm text-gray-500">
            Drag & drop folders to organize your structure.
          </p>
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={tree.items.root.children}
            strategy={verticalListSortingStrategy}
          >
            <ul className="border rounded-lg p-4 bg-gray-50 text-gray-800">
              {tree.items.root.children.map((id) => (
                <SortableItem
                  key={id}
                  id={id}
                  title={tree.items[id].data.title}
                  onClick={() => setSelectedNode(id)}
                  selected={selectedNode === id}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Upload Structure</h2>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center text-gray-500 cursor-pointer"
          >
            <input {...getInputProps()} />
            <FileUp className="mx-auto mb-2" />
            {isDragActive ? "Drop the file here..." : "Drag & drop a .txt with folder structure here"}
          </div>
        </div>

        {selected && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold">Selected: {selected.data.title}</h3>
            <p className="text-sm text-gray-500">Tags: {selected.data.tags.join(", ") || "None"}</p>
            <Button className="mt-2" onClick={classifyNode}>
              Classify & Tag
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}