import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Groups = () => {
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {

    fetchGroups();
    
  }, []);

  const fetchGroups = async () => {
    const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage
    if (!userId) {
      console.error('User ID is not found in local storage');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}/groups`);
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      console.error('Group name cannot be empty');
      return;
    }

    const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage

    if (!userId) {
      console.error('User ID is not found in local storage');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/creategroup', { name: groupName, userId });
      setGroupName('');
      fetchGroups(); // Refresh the list of groups
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleGroupClick = (groupId) => {
    Navigate(`/groups/${groupId}`);
  };

  return (
    <div>
      <h1>after login</h1>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
      />
      <button onClick={handleCreateGroup}>Create</button>
      <h2>Groups</h2>
      <ul>
        {groups.map(group => (
          <li key={group.id} onClick={() => handleGroupClick(group.id)}>{group.name} </li>
          
        ))}
      </ul>
    </div>
  );
};
