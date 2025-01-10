import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Settings,
  ChevronRight,
  Save,
  Image,
  Link,
  Clock,
  Tag,
  Users,
  BarChart,
  Workflow,
  ArrowRight,
  Trash2,
  Copy,
  AlertCircle,
  FileText,
  Video,
  Music,
  PlusCircle,
  Filter,
  Search,
  MoreVertical,
  ChevronDown
} from 'lucide-react';

interface ChatNode {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'carousel';
  message: string;
  responses: Response[];
  delay: number;
  conditions: Condition[];
  tags: string[];
  metadata: {
    created: string;
    modified: string;
    analytics: {
      sent: number;
      clicked: number;
      converted: number;
    };
  };
  media?: {
    url?: string;
    caption?: string;
    type?: string;
  };
}

interface Response {
  id: string;
  text: string;
  type: 'reply' | 'url' | 'phone' | 'location';
  action?: {
    type: 'jump' | 'link' | 'tag' | 'subscribe';
    value: string;
  };
}

interface Condition {
  id: string;
  type: 'tag' | 'custom_field' | 'timing';
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: string;
}

function App() {
  const [nodes, setNodes] = useState<ChatNode[]>([
    {
      id: '1',
      type: 'text',
      message: 'Welcome! How can I help you today?',
      responses: [
        {
          id: '1',
          text: 'Get Started',
          type: 'reply',
          action: { type: 'jump', value: '2' }
        },
        {
          id: '2',
          text: 'Learn More',
          type: 'url',
          action: { type: 'link', value: 'https://example.com' }
        }
      ],
      delay: 0,
      conditions: [],
      tags: ['welcome'],
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        analytics: { sent: 0, clicked: 0, converted: 0 }
      }
    }
  ]);

  const [selectedNode, setSelectedNode] = useState<string>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'message' | 'conditions' | 'analytics'>('message');

  const addNode = (type: ChatNode['type'] = 'text') => {
    const newNode: ChatNode = {
      id: Date.now().toString(),
      type,
      message: 'New message',
      responses: [{ id: '1', text: 'Reply', type: 'reply' }],
      delay: 0,
      conditions: [],
      tags: [],
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        analytics: { sent: 0, clicked: 0, converted: 0 }
      }
    };
    setNodes([...nodes, newNode]);
  };

  const deleteNode = (id: string) => {
    if (nodes.length > 1) {
      setNodes(nodes.filter(node => node.id !== id));
      setSelectedNode(nodes[0].id);
    }
  };

  const duplicateNode = (id: string) => {
    const nodeToDuplicate = nodes.find(node => node.id === id);
    if (nodeToDuplicate) {
      const newNode = {
        ...nodeToDuplicate,
        id: Date.now().toString(),
        message: `${nodeToDuplicate.message} (Copy)`,
        metadata: {
          ...nodeToDuplicate.metadata,
          created: new Date().toISOString(),
          modified: new Date().toISOString()
        }
      };
      setNodes([...nodes, newNode]);
    }
  };

  const currentNode = nodes.find(n => n.id === selectedNode);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Flow Builder
          </h1>
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
          </div>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => addNode('text')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Message
            </button>
            <div className="relative group">
              <button
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Add Content
                <ChevronDown className="w-4 h-4 ml-auto" />
              </button>
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block z-10">
                <button
                  onClick={() => addNode('image')}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left"
                >
                  <Image className="w-4 h-4" />
                  Image
                </button>
                <button
                  onClick={() => addNode('video')}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left"
                >
                  <Video className="w-4 h-4" />
                  Video
                </button>
                <button
                  onClick={() => addNode('audio')}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left"
                >
                  <Music className="w-4 h-4" />
                  Audio
                </button>
                <button
                  onClick={() => addNode('file')}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left"
                >
                  <FileText className="w-4 h-4" />
                  File
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {nodes
              .filter(node => 
                node.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                node.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map(node => (
                <div
                  key={node.id}
                  className={`p-3 rounded-lg mb-2 cursor-pointer ${
                    selectedNode === node.id ? 'bg-blue-50 border-blue-200 border' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {node.type === 'text' && <MessageSquare className="w-4 h-4 text-gray-400" />}
                        {node.type === 'image' && <Image className="w-4 h-4 text-gray-400" />}
                        {node.type === 'video' && <Video className="w-4 h-4 text-gray-400" />}
                        {node.type === 'audio' && <Music className="w-4 h-4 text-gray-400" />}
                        {node.type === 'file' && <FileText className="w-4 h-4 text-gray-400" />}
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {node.message}
                        </span>
                      </div>
                      {node.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {node.tags.map(tag => (
                            <span
                              key={tag}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateNode(node.id);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNode(node.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedNode(node.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {currentNode && (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold text-gray-800">Edit Message</h2>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setActiveTab('message')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${
                              activeTab === 'message'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            Message
                          </button>
                          <button
                            onClick={() => setActiveTab('conditions')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${
                              activeTab === 'conditions'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            Conditions
                          </button>
                          <button
                            onClick={() => setActiveTab('analytics')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${
                              activeTab === 'analytics'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            Analytics
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowSettings(!showSettings)}
                          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {activeTab === 'message' && (
                      <div className="space-y-6">
                        {/* Message Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message Type
                          </label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setNodes(nodes.map(node =>
                                  node.id === selectedNode
                                    ? { ...node, type: 'text' }
                                    : node
                                ));
                              }}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                                currentNode.type === 'text'
                                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <MessageSquare className="w-4 h-4" />
                              Text
                            </button>
                            <button
                              onClick={() => {
                                setNodes(nodes.map(node =>
                                  node.id === selectedNode
                                    ? { ...node, type: 'image' }
                                    : node
                                ));
                              }}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                                currentNode.type === 'image'
                                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <Image className="w-4 h-4" />
                              Image
                            </button>
                            <button
                              onClick={() => {
                                setNodes(nodes.map(node =>
                                  node.id === selectedNode
                                    ? { ...node, type: 'video' }
                                    : node
                                ));
                              }}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                                currentNode.type === 'video'
                                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <Video className="w-4 h-4" />
                              Video
                            </button>
                          </div>
                        </div>

                        {/* Message Text */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message Text
                          </label>
                          <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                            value={currentNode.message}
                            onChange={(e) => {
                              setNodes(nodes.map(node => 
                                node.id === selectedNode 
                                  ? { ...node, message: e.target.value }
                                  : node
                              ));
                            }}
                          />
                        </div>

                        {/* Media Upload (for image/video/audio types) */}
                        {(currentNode.type === 'image' || currentNode.type === 'video' || currentNode.type === 'audio') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Media Upload
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <div className="flex flex-col items-center">
                                {currentNode.type === 'image' && <Image className="w-8 h-8 text-gray-400 mb-2" />}
                                {currentNode.type === 'video' && <Video className="w-8 h-8 text-gray-400 mb-2" />}
                                {currentNode.type === 'audio' && <Music className="w-8 h-8 text-gray-400 mb-2" />}
                                <p className="text-sm text-gray-600">
                                  Drag and drop your {currentNode.type} here, or
                                  <button className="text-blue-600 hover:text-blue-700 font-medium mx-1">
                                    browse
                                  </button>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Maximum file size: 10MB
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Quick Replies */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quick Replies
                          </label>
                          {currentNode.responses.map((response, index) => (
                            <div key={response.id} className="flex gap-2 mb-2">
                              <select
                                className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={response.type}
                                onChange={(e) => {
                                  setNodes(nodes.map(node =>
                                    node.id === selectedNode
                                      ? {
                                          ...node,
                                          responses: node.responses.map((r, i) =>
                                            i === index
                                              ? { ...r, type: e.target.value as Response['type'] }
                                              : r
                                          )
                                        }
                                      : node
                                  ));
                                }}
                              >
                                <option value="reply">Reply</option>
                                <option value="url">URL</option>
                                <option value="phone">Phone</option>
                                <option value="location">Location</option>
                              </select>
                              <input
                                type="text"
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={response.text}
                                onChange={(e) => {
                                  setNodes(nodes.map(node =>
                                    node.id === selectedNode
                                      ? {
                                          ...node,
                                          responses: node.responses.map((r, i) =>
                                            i === index
                                              ? { ...r, text: e.target.value }
                                              : r
                                          )
                                        }
                                      : node
                                  ));
                                }}
                              />
                              {response.type === 'url' && (
                                <input
                                  type="text"
                                  placeholder="Enter URL"
                                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={response.action?.value || ''}
                                  onChange={(e) => {
                                    setNodes(nodes.map(node =>
                                      node.id === selectedNode
                                        ? {
                                            ...node,
                                            responses: node.responses.map((r, i) =>
                                              i === index
                                                ? {
                                                    ...r,
                                                    action: { type: 'link', value: e.target.value }
                                                  }
                                                : r
                                            )
                                          }
                                        : node
                                    ));
                                  }}
                                />
                              )}
                              <button
                                onClick={() => {
                                  setNodes(nodes.map(node =>
                                    node.id === selectedNode
                                      ? {
                                          ...node,
                                          responses: [
                                            ...node.responses.slice(0, index),
                                            ...node.responses.slice(index + 1)
                                          ]
                                        }
                                      : node
                                  ));
                                }}
                                className="p-2 text-gray-500 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              setNodes(nodes.map(node =>
                                node.id === selectedNode
                                  ? {
                                      ...node,
                                      responses: [
                                        ...node.responses,
                                        {
                                          id: Date.now().toString(),
                                          text: 'New Reply',
                                          type: 'reply'
                                        }
                                      ]
                                    }
                                  : node
                              ));
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            + Add Reply
                          </button>
                        </div>

                        {/* Tags */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {currentNode.tags.map((tag, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                              >
                                <Tag className="w-3 h-3" />
                                <span className="text-sm">{tag}</span>
                                <button
                                  onClick={() => {
                                    setNodes(nodes.map(node =>
                                      node.id === selectedNode
                                        ? {
                                            ...node,
                                            tags: node.tags.filter((_, i) => i !== index)
                                          }
                                        : node
                                    ));
                                  }}
                                  className="text-gray-500 hover:text-red-500"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <input
                              type="text"
                              placeholder="Add tag..."
                              className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value) {
                                  setNodes(nodes.map(node =>
                                    node.id === selectedNode
                                      ? {
                                          ...node,
                                          tags: [...node.tags, e.currentTarget.value]
                                        }
                                      : node
                                  ));
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                          </div>
                        </div>

                        {/* Delay Settings */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Delay Before Sending
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="300"
                              className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={currentNode.delay}
                              onChange={(e) => {
                                setNodes(nodes.map(node =>
                                  node.id === selectedNode
                                    ? { ...node, delay: parseInt(e.target.value) }
                                    : node
                                ));
                              }}
                            />
                            <span className="text-sm text-gray-600">seconds</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'conditions' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-800">Flow Conditions</h3>
                          <button
                            onClick={() => {
                              setNodes(nodes.map(node =>
                                node.id === selectedNode
                                  ? {
                                      ...node,
                                      conditions: [
                                        ...node.conditions,
                                        {
                                          id: Date.now().toString(),
                                          type: 'tag',
                                          operator: 'equals',
                                          value: ''
                                        }
                                      ]
                                    }
                                  : node
                              ));
                            }}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                          >
                            <Plus className="w-4 h-4" />
                            Add Condition
                          </button>
                        </div>

                        {currentNode.conditions.map((condition, index) => (
                          <div
                            key={condition.id}
                            className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg"
                          >
                            <select
                              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={condition.type}
                              onChange={(e) => {
                                setNodes(nodes.map(node =>
                                  node.id === selectedNode
                                    ? {
                                        ...node,
                                        conditions: node.conditions.map((c, i) =>
                                          i === index
                                            ? { ...c, type: e.target.value as Condition['type'] }
                                            : c
                                        )
                                      }
                                    : node
                                ));
                              }}
                            >
                              <option value="tag">Tag</option>
                              <option value="custom_field">Custom Field</option>
                              <option value="timing">Timing</option>
                            </select>
                            <select
                              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={condition.operator}
                              onChange={(e) => {
                                setNodes(nodes.map(node =>
                                  node.id === selectedNode
                                    ? {
                                        ...node,
                                        conditions: node.conditions.map((c, i) =>
                                          i === index
                                            ? { ...c, operator: e.target.value as Condition['operator'] }
                                            : c
                                        )
                                      }
                                    : node
                                ));
                              }}
                            >
                              <option value="equals">Equals</option>
                              <option value="contains">Contains</option>
                              <option value="greater_than">Greater Than</option>
                              <option value="less_than">Less Than</option>
                            </select>
                            <input
                              type="text"
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={condition.value}
                              onChange={(e) => {
                                setNodes(nodes.map(node =>
                                  node.id === selectedNode
                                    ? {
                                        ...node,
                                        conditions: node.conditions.map((c, i) =>
                                          i === index
                                            ? { ...c, value: e.target.value }
                                            : c
                                        )
                                      }
                                    : node
                                ));
                              }}
                            />
                            <button
                              onClick={() => {
                                setNodes(nodes.map(node =>
                                  node.id === selectedNode
                                    ? {
                                        ...node,
                                        conditions: node.conditions.filter((_, i) => i !== index)
                                      }
                                    : node
                                ));
                              }}
                              className="p-2 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {currentNode.conditions.length === 0 && (
                          <div className="text-center py-8">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                              No conditions set. This message will be sent to everyone.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'analytics' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-gray-700">Messages Sent</h4>
                              <BarChart className="w-4 h-4 text-gray-400" />
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">
                              {currentNode.metadata.analytics.sent}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-gray-700">Click Rate</h4>
                              <Link className="w-4 h-4 text-gray-400" />
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">
                              {currentNode.metadata.analytics.clicked > 0
                                ? `${((currentNode.metadata.analytics.clicked / currentNode.metadata.analytics.sent) * 100).toFixed(1)}%`
                                : '0%'}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-gray-700">Conversion Rate</h4>
                              <Users className="w-4 h-4 text-gray-400" />
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">
                              {currentNode.metadata.analytics.converted > 0
                                ? `${((currentNode.metadata.analytics.converted / currentNode.metadata.analytics.sent) * 100).toFixed(1)}%`
                                : '0%'}
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-4">Performance Over Time</h4>
                          <div className="h-48 flex items-end justify-between">
                            {/* Placeholder for charts - in a real app, use a charting library */}
                            <div className="w-8 bg-blue-500 h-24 rounded-t"></div>
                            <div className="w-8 bg-blue-500 h-32 rounded-t"></div>
                            <div className="w-8 bg-blue-500 h-16 rounded-t"></div>
                            <div className="w-8 bg-blue-500 h-40 rounded-t"></div>
                            <div className="w-8 bg-blue-500 h-28 rounded-t"></div>
                            <div className="w-8 bg-blue-500 h-36 rounded-t"></div>
                            <div className="w-8 bg-blue-500 h-20 rounded-t"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Last modified: {new Date(currentNode.metadata.modified).toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
                          Cancel
                        </button>
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          <Save className="w-4 h-4" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview</h2>
                  <div className="max-w-sm mx-auto bg-gray-100 rounded-lg p-4">
                    {currentNode.type === 'text' && (
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-gray-800">{currentNode.message}</p>
                      </div>
                    )}
                    {currentNode.type === 'image' && currentNode.media?.url && (
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <img
                          src={currentNode.media.url}
                          alt={currentNode.media.caption || 'Preview'}
                          className="w-full h-auto rounded-lg"
                        />
                        {currentNode.media.caption && (
                          <p className="mt-2 text-sm text-gray-600">{currentNode.media.caption}</p>
                        )}
                      </div>
                    )}
                    {currentNode.type === 'video' && currentNode.media?.url && (
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <video
                          src={currentNode.media.url}
                          controls
                          className="w-full h-auto rounded-lg"
                        />
                        {currentNode.media.caption && (
                          <p className="mt-2 text-sm text-gray-600">{currentNode.media.caption}</p>
                        )}
                      </div>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {currentNode.responses.map((response) => (
                        <button
                          key={response.id}
                          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors"
                        >
                          {response.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;