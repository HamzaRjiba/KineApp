import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    fullName: '',
    firstName: '',
    lastName: '',
    userId: '',
    Nom: '',
  });

  const getName = () => {
    return userData.fullName;
  };

  const setName = (name) => {
    setUserData({ ...userData, fullName: name });
  };

  const getFirstName = () => {
    return userData.firstName;
  };

  const setNom = (name) => {
    setUserData({ ...userData, Nom: name });
  };

  const getNom = () => {
    return userData.Nom;
  };

  const setFirstName = (firstName) => {
    setUserData({ ...userData, firstName });
  };

  const getLastName = () => {
    return userData.lastName;
  };

  const setLastName = (lastName) => {
    setUserData({ ...userData, lastName });
  };

  const getUserId = () => {
    return userData.userId;
  };

  const setUserId = (userId) => {
    setUserData({ ...userData, userId });
  };

  const updateUserData = (data) => {
    setUserData({ ...userData, ...data });
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        getName,
        setName,
        getFirstName,
        setFirstName,
        getLastName,
        setLastName,
        getUserId,
        setUserId,
        setNom,
        getNom,
        updateUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  return useContext(UserContext);
};

export { UserProvider, useUser };
