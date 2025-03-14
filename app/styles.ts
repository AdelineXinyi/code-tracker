export const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: "flex",
      height: "100vh", // Full screen height
    },
    leftSection: {
      flex: 3,
      padding: "20px",
      borderRight: "1px solid #ddd", // Add a border between sections
      overflowY: "auto", // Correct way to define overflowY as string
    },
    problemSelectContainer: {
      marginBottom: "20px",
    },
    problemCountBox: {
      backgroundColor: "#f1f1f1",
      padding: "10px",
      borderRadius: "5px",
      marginTop: "20px",
      fontSize: "14px",
      fontWeight: "bold",
    },
    addProblemContainer: {
      marginTop: "20px",
    },
    rightSection: {
      flex: 7,
      padding: "20px",
      overflowY: "auto", // Correct way to define overflowY as string
    },
    input: {
      border: "1px solid black", // Adding black border to input fields
      padding: "8px",
      marginBottom: "10px",
      width: "100%", // Ensure it takes up the full width
    },
    textarea: {
      border: "1px solid black", // Adding black border to textarea
      padding: "8px",
      marginBottom: "10px",
      width: "100%",
      minHeight: "100px", // Give it a minimum height for a better user experience
    },
    monacoEditor: {
      border: "1px solid black", // Adding black border to Monaco editor
    },
  };