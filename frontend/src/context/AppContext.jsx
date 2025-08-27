import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAllFolders();
      fetchImages(null);
    }
  }, [user]);

  const fetchAllFolders = useCallback(async () => {
    try {
      const response = await api.get('/folders/all');
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  }, []);

  const fetchImages = useCallback(async (folderId = null) => {
    try {
      setLoading(true);
      const params = folderId ? { folderId } : {};
      const response = await api.get('/images', { params });
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createFolder = async (folderData) => {
    try {
      const response = await api.post('/folders', folderData);
      await fetchAllFolders();
      return { success: true, folder: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create folder' 
      };
    }
  };

  const uploadImage = async (formData) => {
    try {
      setLoading(true);
      const response = await api.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await fetchImages(currentFolder?._id);
      return { success: true, image: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to upload image' 
      };
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Use useCallback to prevent infinite re-renders
  const searchImages = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/images/search', { params: { query } });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching images:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since it doesn't depend on any state

  const deleteImage = async (imageId) => {
    try {
      await api.delete(`/images/${imageId}`);
      await fetchImages(currentFolder?._id);
      // Also update search results if we're currently searching
      if (searchQuery.trim()) {
        await searchImages(searchQuery);
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete image' 
      };
    }
  };

  const deleteFolder = async (folderId) => {
    try {
      await api.delete(`/folders/${folderId}`);
      await fetchAllFolders();
      if (currentFolder?._id === folderId) {
        setCurrentFolder(null);
        fetchImages(null);
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete folder' 
      };
    }
  };

  const navigateToFolder = (folder) => {
    setCurrentFolder(folder);
    fetchImages(folder?._id);
    // Clear search when navigating
    setSearchQuery('');
    setSearchResults([]);
  };

  const value = {
    folders,
    images,
    currentFolder,
    searchQuery,
    searchResults,
    loading,
    setSearchQuery,
    fetchAllFolders,
    fetchImages,
    createFolder,
    uploadImage,
    searchImages,
    deleteImage,
    deleteFolder,
    navigateToFolder
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
