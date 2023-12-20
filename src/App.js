
import AlbumList from "./components/AlbumList";

// App component as the main entry point of the application
function App() {
  return (
    // Container for the entire application
    <div className="container">
      {/* Render the AlbumList component */}
      <AlbumList />
    </div>
  );
}

// Export the App component as the default export
export default App;
