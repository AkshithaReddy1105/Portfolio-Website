import axios from "axios";
import React, { useEffect, useState } from "react";

function Todo() {
    const [todoList, setTodoList] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [editedDeadline, setEditedDeadline] = useState("");
    const [newTask, setNewTask] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [newDeadline, setNewDeadline] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:3001/getTodoList")
            .then(result => setTodoList(result.data))
            .catch(err => console.log(err));
    }, []);

    const toggleEditable = (id) => {
        const rowData = todoList.find((data) => data._id === id);
        if (rowData) {
            setEditableId(id);
            setEditedTask(rowData.task);
            setEditedStatus(rowData.status);
            setEditedDeadline(rowData.deadline || "");
        } else {
            setEditableId(null);
            setEditedTask("");
            setEditedStatus("");
            setEditedDeadline("");
        }
    };

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask || !newStatus || !newDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        axios.post("http://127.0.0.1:3001/addTodoList", { task: newTask, status: newStatus, deadline: newDeadline })
            .then(() => {
                setNewTask("");
                setNewStatus("");
                setNewDeadline("");
                setShowAddForm(false);
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    const saveEditedTask = (id) => {
        if (!editedTask || !editedStatus || !editedDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        axios.post("http://127.0.0.1:3001/updateTodoList/" + id, {
            task: editedTask,
            status: editedStatus,
            deadline: editedDeadline,
        })
            .then(() => {
                setEditableId(null);
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    const deleteTask = (id) => {
        axios.delete("http://127.0.0.1:3001/deleteTodoList/" + id)
            .then(() => window.location.reload())
            .catch(err => console.log(err));
    };

    const toggleTaskStatus = (id) => {
        const task = todoList.find(todo => todo._id === id);
        const newStatus = task.status === "Completed" ? "Pending" : "Completed";
        
        axios.post("http://127.0.0.1:3001/updateTodoList/" + id, {
            task: task.task,
            status: newStatus,
            deadline: task.deadline,
        })
            .then(() => window.location.reload())
            .catch(err => console.log(err));
    };

    const getFilteredTodos = () => {
        return todoList.filter(todo => {
            const matchesFilter = filterStatus === "all" || 
                (filterStatus === "completed" && todo.status === "Completed") ||
                (filterStatus === "pending" && todo.status === "Pending");
            
            const matchesSearch = todo.task.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesFilter && matchesSearch;
        });
    };

    const getDeadlineColor = (deadline, status) => {
        if (status === "Completed") return "text-green-600";
        
        const deadlineDate = new Date(deadline);
        const now = new Date();
        const diffHours = (deadlineDate - now) / (1000 * 60 * 60);
        
        if (diffHours < 0) return "text-red-500";
        if (diffHours < 24) return "text-orange-500";
        return "text-gray-600";
    };

    const formatDeadline = (deadline) => {
        const date = new Date(deadline);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        if (isToday) {
            return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const pendingCount = todoList.filter(todo => todo.status === "Pending").length;
    const completedCount = todoList.filter(todo => todo.status === "Completed").length;

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #f3e8ff 100%)',
            padding: '2rem 1rem'
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #f3f4f6',
            transition: 'all 0.3s ease'
        },
        cardHover: {
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transform: 'translateY(-2px)'
        },
        gradientButton: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: '500',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        input: {
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '1rem',
            transition: 'all 0.2s ease',
            outline: 'none'
        },
        inputFocus: {
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
        },
        badge: {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '500'
        }
    };

    return (
        <div style={styles.container}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                        📋 Task Manager
                    </h1>
                    <p style={{ color: '#6b7280' }}>Stay organized and productive</p>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ ...styles.card, padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', margin: '0 0 0.5rem 0' }}>Total Tasks</p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{todoList.length}</p>
                            </div>
                            <div style={{ backgroundColor: '#dbeafe', padding: '0.75rem', borderRadius: '50%' }}>
                                <span style={{ fontSize: '1.5rem' }}>📊</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ ...styles.card, padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', margin: '0 0 0.5rem 0' }}>Pending</p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>{pendingCount}</p>
                            </div>
                            <div style={{ backgroundColor: '#fef3c7', padding: '0.75rem', borderRadius: '50%' }}>
                                <span style={{ fontSize: '1.5rem' }}>⏳</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ ...styles.card, padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', margin: '0 0 0.5rem 0' }}>Completed</p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>{completedCount}</p>
                            </div>
                            <div style={{ backgroundColor: '#d1fae5', padding: '0.75rem', borderRadius: '50%' }}>
                                <span style={{ fontSize: '1.5rem' }}>✅</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div style={{ ...styles.card, padding: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Search */}
                        <div style={{ position: 'relative', flex: '1', maxWidth: '400px', minWidth: '250px' }}>
                            <input
                                type="text"
                                placeholder="🔍 Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    ...styles.input,
                                    paddingLeft: '2.5rem'
                                }}
                                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                                onBlur={(e) => Object.assign(e.target.style, { borderColor: '#d1d5db', boxShadow: 'none' })}
                            />
                        </div>

                        {/* Filter */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <select 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                style={styles.input}
                            >
                                <option value="all">All Tasks</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>


                        {/* Add Task Button */}
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            style={styles.gradientButton}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            ➕ Add Task
                        </button>
                    </div>
                </div>

                {/* Add Task Form */}
                {showAddForm && (
                    <div style={{ ...styles.card, padding: '1.5rem', marginBottom: '2rem', animation: 'fadeIn 0.3s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>✨ Add New Task</h3>
                            <button
                                onClick={() => setShowAddForm(false)}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    fontSize: '1.5rem', 
                                    cursor: 'pointer',
                                    color: '#6b7280'
                                }}
                            >
                                ❌
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                    Task Description
                                </label>
                                <input
                                    type="text"
                                    placeholder="What needs to be done?"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    style={styles.input}
                                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                                    onBlur={(e) => Object.assign(e.target.style, { borderColor: '#d1d5db', boxShadow: 'none' })}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                        Status
                                    </label>
                                    <select 
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        style={styles.input}
                                    >
                                        <option value="">Select status</option>
                                        <option value="Pending">⏳ Pending</option>
                                        <option value="Completed">✅ Completed</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                        Deadline
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={newDeadline}
                                        onChange={(e) => setNewDeadline(e.target.value)}
                                        style={styles.input}
                                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                                        onBlur={(e) => Object.assign(e.target.style, { borderColor: '#d1d5db', boxShadow: 'none' })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button
                                    onClick={addTask}
                                    style={{
                                        ...styles.gradientButton,
                                        flex: 1,
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        padding: '0.75rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                    }}
                                >
                                    🚀 Create Task
                                </button>
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#f3f4f6',
                                        color: '#374151',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        transition: 'background-color 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Task Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {getFilteredTodos().map((data) => (
                        <div 
                            key={data._id} 
                            style={styles.card}
                            onMouseEnter={(e) => Object.assign(e.target.style, styles.cardHover)}
                            onMouseLeave={(e) => Object.assign(e.target.style, { 
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                transform: 'translateY(0)'
                            })}
                        >
                            {editableId === data._id ? (
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        <input
                                            type="text"
                                            value={editedTask}
                                            onChange={(e) => setEditedTask(e.target.value)}
                                            style={styles.input}
                                        />
                                        <select
                                            value={editedStatus}
                                            onChange={(e) => setEditedStatus(e.target.value)}
                                            style={styles.input}
                                        >
                                            <option value="Pending">⏳ Pending</option>
                                            <option value="Completed">✅ Completed</option>
                                        </select>
                                        <input
                                            type="datetime-local"
                                            value={editedDeadline}
                                            onChange={(e) => setEditedDeadline(e.target.value)}
                                            style={styles.input}
                                        />
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button 
                                                onClick={() => saveEditedTask(data._id)}
                                                style={{
                                                    ...styles.gradientButton,
                                                    flex: 1,
                                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                    padding: '0.5rem'
                                                }}
                                            >
                                                💾 Save
                                            </button>
                                            <button 
                                                onClick={() => toggleEditable(null)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: '#f3f4f6',
                                                    color: '#374151',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ padding: '1.5rem' }}>
                                        {/* Status Badge */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <span style={{
                                                ...styles.badge,
                                                backgroundColor: data.status === "Completed" ? '#d1fae5' : '#fef3c7',
                                                color: data.status === "Completed" ? '#065f46' : '#92400e'
                                            }}>
                                                {data.status === "Completed" ? '✅' : '⏳'} {data.status}
                                            </span>
                                        </div>

                                        {/* Task Title */}
                                        <h3 style={{ 
                                            fontSize: '1.125rem', 
                                            fontWeight: '600', 
                                            marginBottom: '1rem',
                                            color: data.status === "Completed" ? '#6b7280' : '#1f2937',
                                            textDecoration: data.status === "Completed" ? 'line-through' : 'none'
                                        }}>
                                            {data.task}
                                        </h3>

                                        {/* Deadline */}
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '0.5rem', 
                                            fontSize: '0.875rem', 
                                            marginBottom: '1.5rem',
                                            color: getDeadlineColor(data.deadline, data.status).replace('text-', '')
                                        }}>
                                            <span>📅</span>
                                            {data.deadline ? formatDeadline(data.deadline) : "No deadline"}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ 
                                        padding: '0 1.5rem 1.5rem', 
                                        display: 'flex', 
                                        gap: '0.5rem',
                                        borderTop: '1px solid #f3f4f6',
                                        marginTop: '1rem',
                                        paddingTop: '1rem'
                                    }}>
                                        <button 
                                            onClick={() => toggleTaskStatus(data._id)}
                                            style={{
                                                flex: 1,
                                                padding: '0.5rem',
                                                borderRadius: '8px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: '500',
                                                backgroundColor: data.status === "Completed" ? '#fef3c7' : '#d1fae5',
                                                color: data.status === "Completed" ? '#92400e' : '#065f46',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {data.status === "Completed" ? '🔄 Mark Pending' : '✅ Complete'}
                                        </button>
                                        <button 
                                            onClick={() => toggleEditable(data._id)}
                                            style={{
                                                padding: '0.5rem',
                                                backgroundColor: '#dbeafe',
                                                color: '#1d4ed8',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            onClick={() => deleteTask(data._id)}
                                            style={{
                                                padding: '0.5rem',
                                                backgroundColor: '#fecaca',
                                                color: '#dc2626',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {getFilteredTodos().length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <div style={{ 
                            fontSize: '4rem', 
                            marginBottom: '1rem',
                            opacity: 0.5
                        }}>
                            📋
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
                            No tasks found
                        </h3>
                        <p style={{ color: '#9ca3af' }}>
                            {searchTerm || filterStatus !== "all" 
                                ? "Try adjusting your search or filter criteria"
                                : "Create your first task to get started"
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Add some CSS animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default Todo;