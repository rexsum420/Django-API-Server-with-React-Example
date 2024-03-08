import React, { useState, useEffect, useCallback } from 'react';
import Task from '../components/Task';
import update from 'immutability-helper';
import CustomCard from '../components/TaskBox';

const style = {
  width: '80%',
  alignItems: 'center',
};

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
      setCards(
        update(cards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        })
      );
    },
    [cards]
  );

  const renderCard = (card, index) => {
    return (
      <Task
        key={card.id}
        index={index}
        id={card.id}
        text={card.task} // Use task from the fetched data
        moveCard={moveCard}
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

  const handleSave = async() => {
      try {
        const token = localStorage.getItem('Token');
        
        // Prepare data for API call
        const requestData = cards.map(card => ({
          id: card.id,
          priority: card.priority,
          task: card.task,
          completed: card.completed || false, // If checkbox is unchecked, set completed to false
        }));
    
        // Prepare requests for updating existing tasks
        const updateRequests = requestData.map(item => {
          return fetch(`http://localhost:8000/api/todolists/${item.id}/`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ priority: item.priority, task: item.task, completed: item.completed }),
          });
        });
    
        // Prepare requests for adding new tasks
        const newTasks = cards.filter(card => !card.id);
        const createRequests = newTasks.map(item => {
          return fetch('http://localhost:8000/api/todolists/', {
            method: 'POST',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task: item.task, completed: item.completed || false }), // Set completed to false for new tasks
          });
        });
    
        // Execute all requests concurrently
        await Promise.all([...updateRequests, ...createRequests]);
        
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
        console.log(error);
      }
    };
    

  return (
    <>
      <div style={style}>
        {cards.map((card, i) => renderCard(card, i))}
        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task..."
          />
          <button onClick={handleAddTask}>Add Task</button>
        </div>
        <button onClick={handleSave}>
            Save
        </button>
      </div>
    </>
  );
};

export default Home;
