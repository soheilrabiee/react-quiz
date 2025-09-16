const { createContext, useContext } = require("react");

const QuizContext = createContext();

function QuizProvider() {}

function useQuiz() {
    const context = useContext(QuizContext);
    if (context === undefined)
        throw new Error("Quiz context was used outside the QuizProvider!");
    return context;
}

export { QuizProvider, useQuiz };
