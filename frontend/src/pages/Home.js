import React, { useState, useEffect, useCallback } from 'react';
import Task from '../components/Task';
import update from 'immutability-helper';

const Home = () => {
  const [cards, setCards] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('Token');
        const response = await fetch('http://localhost:8000/api/todolists/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cards[dragIndex];
      setCards(update(cards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }));
    },
    [cards]
  );
  
  
  const handleDelete = (id) => {
    // Filter out the card with the given id
    const updatedCards = cards.filter(card => card.id !== id);
    setCards(updatedCards);
  };

  const renderCard = (card, index) => {
    return (
      <Task
        key={card.id}
        index={index}
        id={card.id}
        text={card.task}
        moveCard={moveCard}
        onDelete={() => handleDelete(card.id)}
      />
    );
  };

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const newCard = { id: cards.length + 1, task: newTask };
      setCards([...cards, newCard]);
      setNewTask('');
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('Token');
  
      // Fetch current tasks in the database
      const response = await fetch('http://localhost:8000/api/todolists/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch current tasks from the database');
      }
  
      const currentTasks = await response.json();
  
      // Count the number of tasks in cards vs number of tasks in the database
      const numTasksInCards = cards.length;
      const numTasksInDatabase = currentTasks.length;
  
      // Prepare requests for updating existing tasks and adding new tasks
      const requests = [];
  
      cards.forEach((card, index) => {
        if (index < numTasksInDatabase) {
          // Update existing task
          const updateRequest = fetch(`http://localhost:8000/api/todolists/${currentTasks[index].id}/`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              priority: index + 1, 
              task: card.task, 
            }),          });
          requests.push(updateRequest);
        } else {
          // Add new task
          const createRequest = fetch('http://localhost:8000/api/todolists/', {
            method: 'POST',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task: card.task }),
          });
          requests.push(createRequest);
        }
      });
  
      // Execute all requests concurrently
      await Promise.all(requests);
  
      // If num of tasks in cards < num of tasks in database, delete remaining tasks in database
      if (numTasksInCards < numTasksInDatabase) {
        const deleteRequests = currentTasks
          .slice(numTasksInCards) // Get the tasks in the database beyond the number of tasks in cards
          .map(task => {
            return fetch(`http://localhost:8000/api/todolists/${task.id}/`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
              },
            });
          });
  
        await Promise.all(deleteRequests);
      }
  
      // Fetch updated data and update state if necessary
      const updatedDataResponse = await fetch('http://localhost:8000/api/todolists/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!updatedDataResponse.ok) {
        throw new Error('Failed to fetch updated data');
      }
  
      const updatedData = await updatedDataResponse.json();
      setCards(updatedData);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };
  
  return (
    <>
      <div className='row'>
        <div className='col-9' style={{ width: '75%' }}> {/* Adjusted width to take 75% */}
          {cards.map((card, i) => renderCard(card, i))}
        </div>
        <div className='col-3' style={{ width: '25%' }}> {/* Adjusted width to take 25% */}
          <div style={{ marginTop: '20px' }}>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter new task..."
            />
            <button onClick={handleAddTask}>Add Task</button>
          </div>
          <button onClick={handleSave} style={{ marginTop: '100px' }}>
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
