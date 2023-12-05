import * as React from 'react';

const Sidebar: React.FC = () => {
  // ...component implementation...
  return (
    <div
      style={{
        width: '250px', // Increase width
        height: '100vh', // Cover full height
        backgroundColor: 'rgba(255, 0, 0, 0.5)', // Semi-transparent red
        position: 'fixed',
        zIndex: 9999,
        right: 0, // Position to the right
        top: 0, // Position to the top
        overflowX: 'hidden', // Prevent horizontal scroll
        paddingTop: '20px', // Add some padding at the top
      }}
    >
      Sidebar
      <input
        type="text"
        placeholder="Start a chat..."
        style={{
          width: '90%', // Take up most of the sidebar width
          margin: '10px', // Add some margin around the input
        }}
      />
    </div>
  );
};

export default Sidebar;
