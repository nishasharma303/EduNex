import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { ConceptMap } from '../services/conceptMapService';
import { motion } from 'framer-motion';

interface MindMapProps {
  conceptMap: ConceptMap;
}

// Auto-layout using Dagre
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 150 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - 100,
      y: nodeWithPosition.y - 40,
    };
  });

  return { nodes, edges };
};

export const MindMap = ({ conceptMap }: MindMapProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!conceptMap || conceptMap.concepts.length === 0) return;

    // Convert concepts to ReactFlow nodes
    const initialNodes: Node[] = conceptMap.concepts.map((concept) => ({
      id: concept.id,
      type: 'default',
      data: { 
        label: (
          <div className="text-center">
            <div className="font-semibold text-sm">{concept.label}</div>
            {concept.description && (
              <div className="text-xs text-gray-500 mt-1">{concept.description}</div>
            )}
          </div>
        ) 
      },
      position: { x: 0, y: 0 },
      style: {
        background: concept.level === 0 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : concept.level === 1
          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        color: 'white',
        border: '2px solid rgba(255,255,255,0.3)',
        borderRadius: '12px',
        padding: '16px',
        width: 200,
        fontSize: '14px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    }));

    // Convert relations to ReactFlow edges
    const initialEdges: Edge[] = conceptMap.relations.map((relation, index) => ({
      id: `edge-${index}`,
      source: relation.from,
      target: relation.to,
      type: 'smoothstep',
      animated: relation.type === 'leads-to',
      style: { 
        stroke: relation.type === 'requires' ? '#f5576c' : '#667eea',
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: relation.type === 'requires' ? '#f5576c' : '#667eea',
      },
      label: relation.type,
      labelStyle: { 
        fontSize: 10, 
        fill: '#666',
        fontWeight: 600,
      },
      labelBgStyle: { 
        fill: 'white',
        fillOpacity: 0.8,
      },
    }));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );

    // Animate nodes appearing one by one
    layoutedNodes.forEach((node, index) => {
      setTimeout(() => {
        setNodes((nds) => [...nds, node]);
      }, index * 200);
    });

    setTimeout(() => {
      setEdges(layoutedEdges);
    }, layoutedNodes.length * 200 + 100);

  }, [conceptMap, setNodes, setEdges]);

  return (
    <div className="w-full h-[600px] border-2 border-primary/20 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-purple-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
      >
        <Background gap={16} size={1} color="#e5e7eb" />
        <Controls />
      </ReactFlow>
    </div>
  );
};