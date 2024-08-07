import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CodeEditor from './CodeEditor'; // Import the CodeEditor component

export const GroupDetails = () => {
  const { groupId } = useParams();
  const [ group, setGroup] = useState({});
  const [groupMembers, setGroupMembers] = useState({});
  const [ friendQuery, setFriendQuery ] = useState('');
  const [ searchResults, setSearchResults ] = useState([]);
  const[loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const navigate = useNavigate();

  const fetchGroupDetails = useCallback(async () => {
    const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage

    if (!userId) {
      console.error('User ID is not found in local storage');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
      console.log(response.data);
      setLoading(false);
      setGroup(response.data.group);
      setIsCreator(response.data.group.creator_id === parseInt(userId, 10)); // Check if the current user is the creator
      setGroupMembers(response.data.members);
    } catch (error) {
      console.error('Error fetching group details:', error);
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroupDetails();

  }, [fetchGroupDetails]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/searchuser`, { params: { query: friendQuery } });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching for user:', error);
    }
  };

  const handleAddFriend = async (userId) => {
    const currentUserId = localStorage.getItem('userId'); // Retrieve user ID from local storage
    console.log('Adding friend with userId:', userId);
    console.log('GroupId:', groupId);

    if (!userId || !groupId || !currentUserId) {
      console.error('userId or groupId or currentUserId is undefined');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/groups/${groupId}/addfriend`, { userId });
      setFriendQuery('');
      setSearchResults([]);
      fetchGroupDetails();
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const removeFriend = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/groups/${groupId}/removefriend`, { data: { userId } });
      setGroup(prevGroup => ({
        ...prevGroup,
        members: prevGroup.members.filter((member) => member.id !== userId)
      }));
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };


  const handleDeleteGroup = async () => {
    const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage

    if (!userId) {
      console.error('User ID is not found in local storage');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/groups/${groupId}`, { data: { userId } });
      navigate('/users/:userId/groups'); // Redirect after successful deletion
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  return (
    <div>
      <h2>{group.name}</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ul>
            {groupMembers && groupMembers.map(friend => (
              <li key={friend.id}>{friend.user_name}<button onClick={() => removeFriend(friend.id)}>Remove</button></li>
            ))}
          </ul>
          {isCreator && (
            <button onClick={handleDeleteGroup}>Delete Group</button>
          )}
        </>
      )}
      <input
        type="text"
        value={friendQuery}
        onChange={(e) => setFriendQuery(e.target.value)}
        placeholder="Search by username or email"
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {searchResults.map(user => (
          <li key={user.id}>
            {user.user_name} <button onClick={() => handleAddFriend(user.id)}>Add Member</button>
          </li>
        ))}
      </ul>
      <CodeEditor groupId={groupId} />
    </div>
  );
};
