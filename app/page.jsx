'use client'

//import { set } from 'mongoose';
import React, { useEffect, useState } from 'react';

export default function TodoApp() {
  const [tasks, setTasks] = useState(localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : []);
  const [filteredTasks, setFilteredTasks] = useState([...tasks]);
  const [taskCount, setTaskCount] = useState(localStorage.getItem("taskCount") ? parseInt(localStorage.getItem("taskCount")) : 0);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [filtered, setFiltered] = useState(false);
  const task = {prio:"None", prionum: 0, taskid: "", title: "", desc: "", status: "Not Started", isEditing: false};
  const [datesorted, setdatesorted] = useState(false);
  const [priosorted, setpriosorted] = useState(false);

  const addTask = (task) => {
    const now = new Date();
    const dateString = now.getMonth()+1+"/"+now.getDate()+"/"+now.getFullYear();
    const dateid = now.toString();
    setTasks([...tasks, {prio:"None", prionum: 0, taskid: dateid, date: dateString, title: task.title, desc: task.desc, status: "Not Started", isEditing: false}]);
    setTaskCount(taskCount + 1);
    setdatesorted(false);
    setpriosorted(false);
  };

  const setTaskTitle = (title) => {
    task.title = title;
  };

  const setTaskDesc = (desc) => {
    task.desc = desc;
  }

  const setTaskStatus = (taskid, status) => {
    setTasks(tasks.map(task => task.taskid === taskid ? {...task, status: status} : task));
  };

  const setTaskPrio = (taskid, prio, prionum) => { 
    setTasks(tasks.map(task => task.taskid === taskid ? {...task, prio: prio, prionum: prionum} : task));
    setpriosorted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTaskTitle(title);
    setTaskDesc(desc);
    if (task.title.length === 0 || task.desc.length === 0) {
      alert("Title and description cannot be empty.");
    } else {
      addTask(task);
      console.log(tasks);
      setTitle("");
      setDesc(""); 
    } 
  };

  const deletetask = (taskid) => {
    setTasks(tasks.filter(task => task.taskid !== taskid));
    setTaskCount(taskCount - 1);
    setFilteredTasks(filteredTasks.filter(task => task.taskid !== taskid));
  };

  const edittask = (taskid) => {
    if (filtered) {
      setFilteredTasks(filteredTasks.map(task => task.taskid === taskid ? {...task, isEditing: true} : task));
      setTasks(tasks.map(t2 => filteredTasks.find(t1 => t1.taskid === t2.taskid) || t2));
    } else {
      setTasks(tasks.map(task => task.taskid === taskid ? {...task, isEditing: true} : task));
    }
  };
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
    localStorage.setItem("taskCount", taskCount)
    console.log(tasks)
    } , [tasks], taskCount);

  const filternone = () => {
    setFilteredTasks([...tasks]);
    setFiltered(false);
  };

  const filternotstarted = () => {
    const filtered = tasks.filter(task => task.status.includes("Not Started"));
    setFilteredTasks(filtered);
    setFiltered(true);
  };

  const filterpending = () => {
    const filtered = tasks.filter(task => task.status.includes("Pending"));
    setFilteredTasks(filtered);
    setFiltered(true);
  };

  const filtercompleted = () => {
    const filtered = tasks.filter(task => task.status.includes("Completed"));
    setFilteredTasks(filtered);
    setFiltered(true);
  };

  const sortdate = () => {
    const sorted = [...tasks]
    const filteredsorted = [...filteredTasks]
    if (datesorted) {
      sorted.reverse();
      filteredsorted.reverse();
      setTasks([...sorted]);
      setFilteredTasks([...filteredsorted]);
    } else {
      sorted.sort((a, b) => {
        let fa = a.date.toLowerCase(),
            fb = b.date.toLowerCase();
    
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
        }
      );
      filteredsorted.sort((a, b) => {
        let fa = a.date.toLowerCase(),
            fb = b.date.toLowerCase();
    
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
        }
      );
      setTasks([...sorted]);
      setFilteredTasks([...filteredsorted]);
      setdatesorted(true);
    }
  };

  const sortprio = () => {
    const sorted = [...tasks]
    const filteredsorted = [...filteredTasks]
    if (priosorted) {
      sorted.reverse();
      filteredsorted.reverse();
      setTasks([...sorted]);
      setFilteredTasks([...filteredsorted]);
    } else {
      sorted.sort((a, b) => {
        return a.prionum - b.prionum;
      });
      filteredsorted.sort((a, b) => {
        return a.prionum - b.prionum;
      });
      setTasks([...sorted]);
      setFilteredTasks([...filteredsorted]);
      setpriosorted(true);
    }
  };

  return (
    <>
      <h1 className="m-5 text-2xl font-bold">To Do List</h1>
      <form className="m-5 flex flex-row" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <input type="text" placeholder="Title" className="input input-bordered input-sm w-4/5 max-w-xl" 
                  value={title} onChange={(e) => setTitle(e.target.value)}/>
          <input type="text" placeholder="Description" className="input input-bordered input-md w-4/5 max-w-xl" 
                  value={desc} onChange={(e) => setDesc(e.target.value)}/>
        </div>
        <button type="submit" className="btn btn-primary">Create Task</button>
      </form>


      <div className="m-5 content-center flex flex-row ">
        <h1 className="text font-bold">Filter By: </h1>
        <button className="mx-2 btn btn-s btn-outline" onClick={filternone}>None</button>
        <button className="mx-2 btn btn-s btn-outline btn-info" onClick={filternotstarted}>Not Started</button>
        <button className="mx-2 btn btn-s btn-outline btn-success" onClick={filtercompleted}>Completed</button>
        <button className="mx-2 btn btn-s btn-outline btn-warning" onClick={filterpending}>Pending</button>
      </div>

      <div className="m-5 content-center flex flex-row ">
        <h1 className="text font-bold">Sort By: </h1>
        <button className="mx-2 btn-s btn btn-outline" onClick={sortprio}>Priority</button>
        <button className="mx-2 btn-s btn btn-outline" onClick={sortdate}>Date Created</button>
      </div>

      <table className="mt-5 mr-5 ml-5 table table-xs table-pin-rows table-pin-cols">
          <tbody>
            <tr>
              <th className='w-1/12'><strong>Priority</strong></th> 
              <td className='w-1/12'><strong>Date Created</strong></td> 
              <td className='w-2/12'><strong>Task</strong></td> 
              <td className='w-4/12'><strong>Description</strong></td> 
              <td className='w-2/12'><strong>Status</strong></td>
              <td className='w-1/12'></td>
              <td className='w-1/12'></td>
            </tr>
          </tbody> 
        </table>

      {filtered 
      ?
      filteredTasks.map((task) => (
        task.isEditing 
        ? <EditingTask task={task} key={task.taskid} deletetask={deletetask} edittask={edittask} setTaskPrio={setTaskPrio} setTaskStatus={setTaskStatus}/> 
        : <Task task={task} key={task.taskid} deletetask={deletetask} edittask={edittask} setTaskPrio={setTaskPrio} setTaskStatus={setTaskStatus}/>
      ))
      :
      tasks.map((task) => (
        task.isEditing 
        ? <EditingTask task={task} key={task.taskid} deletetask={deletetask} edittask={edittask} setTaskPrio={setTaskPrio} setTaskStatus={setTaskStatus}/> 
        : <Task task={task} key={task.taskid} deletetask={deletetask} edittask={edittask} setTaskPrio={setTaskPrio} setTaskStatus={setTaskStatus}/>
      ))
      }
    </>
  );
};

export const Task = ({task, deletetask, edittask, setTaskPrio, setTaskStatus}) => {
  return (
    <>
      <div className="mx-5 overflow-visible">
        <table className="table table-xs table-pin-rows table-pin-cols">
          <tbody>
            <tr>
              <th className='w-1/12'><div className="dropdown dropdown-right">
                                        <div tabIndex={0} role="button" className="btn btn-xs">{task.prio}</div>
                                          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                            <li><a onClick={()=>setTaskPrio(task.taskid, "None", 0)}>None</a></li>
                                            <li><a onClick={()=>setTaskPrio(task.taskid, "Low", 1)}>Low</a></li>
                                            <li><a onClick={()=>setTaskPrio(task.taskid, "Medium", 2)}>Medium</a></li>
                                            <li><a onClick={()=>setTaskPrio(task.taskid, "High", 3)}>High</a></li>
                                            <li><a onClick={()=>setTaskPrio(task.taskid, "Urgent", 4)}>Urgent</a></li>
                                          </ul>
                                        </div></th> 
              <td className='w-1/12'>{task.date}</td> 
              <td className='w-2/12'>{task.title}</td> 
              <td className='w-4/12'>{task.desc}</td> 
              <td className='w-2/12'><div className="dropdown dropdown-right">
                                      <div tabIndex={0} role="button" className="btn btn-xs">{task.status}</div>
                                      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                        <li><a onClick={()=>setTaskStatus(task.taskid, "Not Started")}>Not Started</a></li>
                                        <li><a onClick={()=>setTaskStatus(task.taskid, "Pending")}>Pending</a></li>
                                        <li><a onClick={()=>setTaskStatus(task.taskid, "Completed")}>Completed</a></li>
                                      </ul>
                                    </div></td>
              <td className='w-1/12'><button type="button" className="btn btn-xs" onClick={()=>edittask(task.taskid)}>Edit</button></td>
              <td className='w-1/12'><button type="button" className="btn btn-xs" onClick={()=>deletetask(task.taskid)}>Delete</button></td>
            </tr>
          </tbody> 
        </table>
      </div>
    </>
  );
};

export const EditingTask = ({task, deletetask, edittask, setTaskPrio, setTaskStatus}) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const setTaskTitle = (title) => {
    task.title = title;
  };

  const setTaskDesc = (desc) => {
    task.desc = desc;
  }

  const setTaskEditing = () => {
    task.isEditing = false;
  }

  const handleSubmit = (e) => {
    console.log(e);
    e.preventDefault();
    const data = new FormData(e.target);
    setTaskTitle(data.get("title"));
    setTaskDesc(data.get("desc"));
    if (task.title.length === 0 || task.desc.length === 0) {
      alert("Title and description cannot be empty.");
    } else {
      edittask(task.id);
      setTaskEditing();
      setTitle("");
      setDesc(""); 
    } 
  };

  return (
    <>
      <div className="mx-5 overflow-visible">
      <form onSubmit={handleSubmit}>
        <table className="table table-xs table-pin-rows table-pin-cols">
          <tbody>
            <tr>
            <th className='w-1/12'><div className="dropdown dropdown-right">
                                        <div tabIndex={0} role="button" className="btn btn-xs">{task.prio}</div>
                                          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                            <li><a onClick={()=>setTaskPrio(task.taskid, "None")}>None</a></li>
                                            <li><a onClick={()=>setTaskPrio(task.taskid, "Low")}>Low</a></li>
                                            <li><a onClick={()=>setTaskPrio(task.taskid, "Medium")}>Medium</a></li>
                                            <li><a onClick={()=>setTaskPrio(task.taskid, "High")}>High</a></li>
                                            <li><a onClick={()=>setTaskPrio(task.taskid, "Urgent")}>Urgent</a></li>
                                          </ul>
                                        </div></th> 
              <td className='w-1/12'>{task.date}</td> 
              
              <td className='w-2/12'>
                <input type="text" className="input input-bordered input-md w-4/5 max-w-xl" 
                          name="title" defaultValue={task.title}/>
              </td> 
              <td className='w-4/12'>
                <input type="text" className="input input-bordered input-md w-4/5 max-w-xl" 
                          name="desc" defaultValue={task.desc}/>
              </td> 
              <td className='w-2/12'><div className="dropdown dropdown-right">
                                      <div tabIndex={0} role="button" className="btn btn-xs">{task.status}</div>
                                      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                        <li><a onClick={()=>setTaskStatus(task.taskid, "Not Started")}>Not Started</a></li>
                                        <li><a onClick={()=>setTaskStatus(task.taskid, "Pending")}>Pending</a></li>
                                        <li><a onClick={()=>setTaskStatus(task.taskid, "Completed")}>Completed</a></li>
                                      </ul>
                                    </div></td>
              <td className='w-1/12'><button type="submit" className="btn btn-xs">Save</button></td>
              
              <td className='w-1/12'><button type="button" className="btn btn-xs" onClick={()=>deletetask(task.taskid)}>Delete</button></td>
            </tr>
          </tbody> 
        </table>
        </form>
      </div>
    </>
  );
};