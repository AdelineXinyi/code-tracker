"use client";

import { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react"; // Assuming MonacoEditor is correctly installed
import { styles } from "./styles"; // Import styles from a separate file

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  solved: boolean;
  code?: string; // Optional code field
}

const Home = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState<string>("");
  const [newProblem, setNewProblem] = useState<Problem>({
    id: 0,
    title: "",
    difficulty: "",
    solved: false,
    code: "",
  });
  const [problemCount, setProblemCount] = useState<number>(0); // State to track problem count
  const [language, setLanguage] = useState<string>("javascript"); // State to track the selected language

  // Fetch problems from API
  useEffect(() => {
    async function fetchProblems() {
      const res = await fetch("/api/problems");
      if (res.ok) {
        const data = await res.json();
        setProblems(data);
      }
    }

    fetchProblems();
  }, []);

  // Fetch the problem count from the backend (GET_COUNT API)
  useEffect(() => {
    async function fetchProblemCount() {
      const res = await fetch("/api/problems/count");
      if (res.ok) {
        const data = await res.json();
        setProblemCount(data.count); // Set the problem count
      } else {
        console.error("Failed to fetch problem count");
      }
    }

    fetchProblemCount();
  }, []); // This effect runs only once when the component mounts

  // Auto-save feature for updating code after a delay
  useEffect(() => {
    if (selectedProblem) {
      const timeoutId = setTimeout(async () => {
        try {
          const res = await fetch("/api/problems", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: selectedProblem.id, code }),
          });

          if (!res.ok) {
            console.error("Error updating problem code:", res.statusText);
          }
        } catch (error) {
          console.error("Error saving code:", error);
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [code, selectedProblem]);

  // Handle problem selection
  const handleProblemSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value);
    const problem = problems.find((p) => p.id === selectedId);
    setSelectedProblem(problem || null);
    setCode(problem?.code || ""); // Pre-fill the editor with the selected problem's code
  };

  // Handle new problem input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProblem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle problem submission
  const handleAddProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding problem:", newProblem);
    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProblem),
      });
      
      if (res.ok) {
        const newProblemData = await res.json();
        setProblems((prevProblems) => [...prevProblems, newProblemData]);
        setProblemCount((prevCount) => prevCount + 1); // Increment problem count
        setNewProblem({
          id: 0,
          title: "",
          difficulty: "",
          solved: false,
          code: "",
        }); // Reset form
        console.log("Problem added successfully:", newProblemData);
      } else {
        console.error("Error adding problem:", res.statusText);
        const errorDetails = await res.text();
        console.error("Response body:", errorDetails);
      }
    } catch (error) {
      console.error("Error adding problem:", error);
    }
  };

  // Handle language change (Java or Python)
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  // Handle problem deletion
  const handleDeleteProblem = async () => {
    if (selectedProblem) {
      console.log("Deleting problem:", selectedProblem);
  
      try {
        const res = await fetch(`/api/problems`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: selectedProblem.id }), // Send problem id in the request body
        });
  
        if (res.ok) {
          const deletedProblemData = await res.json();
  
          // Update problems list after deletion
          setProblems((prevProblems) => {
            const updatedProblems = prevProblems.filter(
              (problem) => problem.id !== selectedProblem.id
            );
            
            // Update the problem count (decrement by 1)
            setProblemCount(updatedProblems.length);
  
            // Select the first problem if any remain, otherwise null
            setSelectedProblem(updatedProblems.length > 0 ? updatedProblems[0] : null);
            
            return updatedProblems;
          });
  
          console.log("Problem deleted successfully:", deletedProblemData);
        } else {
          console.error("Error deleting problem:", res.statusText);
          const errorDetails = await res.text();
          console.error("Response body:", errorDetails);
        }
      } catch (error) {
        console.error("Error deleting problem:", error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <div style={styles.problemSelectContainer}>
          <h2>Select a Problem</h2>
          <select onChange={handleProblemSelect} value={selectedProblem ? selectedProblem.id : ""}>
            <option value="" disabled>Select a problem</option>
            {problems.map((problem) => (
              <option key={problem.id} value={problem.id}>
                {problem.title}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.problemCountBox}>
          <p>Total Problems: {problemCount}</p>
        </div>

        <div style={styles.addProblemContainer}>
          <h2>Add a New Problem</h2>
          <form onSubmit={handleAddProblem}>
            <div>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newProblem.title}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div>
              <label htmlFor="difficulty">Difficulty:</label>
              <input
                type="text"
                id="difficulty"
                name="difficulty"
                value={newProblem.difficulty}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div>
              <label htmlFor="code">Code:</label>
              <textarea
                id="code"
                name="code"
                value={newProblem.code || ""}
                onChange={handleInputChange}
                style={styles.textarea}
              />
            </div>
            <button type="submit">Add Problem</button>
          </form>
        </div>

        <div style={styles.languageSelectContainer}>
          <label htmlFor="language">Select Language: </label>
          <select id="language" value={language} onChange={handleLanguageChange}>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>

        {selectedProblem && (
          <div>
            <button onClick={handleDeleteProblem}>Delete Problem</button>
          </div>
        )}
      </div>

      <div style={styles.rightSection}>
        {selectedProblem && (
          <MonacoEditor
            height="80vh"
            value={code}
            onChange={(newValue) => setCode(newValue || "")}
            language={language}
            theme="vs-dark"
          />
        )}
      </div>
    </div>
  );
};

export default Home;