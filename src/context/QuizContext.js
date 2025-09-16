const { createContext, useContext, useReducer } = require("react");

const QuizContext = createContext();

const SECS_PER_QUESTION = 30;

const initialState = {
    questions: [],

    // 'loading', 'error', 'ready', 'active', 'finished'
    status: "loading",
    // Question index
    index: 0,
    answer: null,
    points: 0,
    highscore: 0,
    secondsRemaining: null,
};

function reducer(state, action) {
    switch (action.type) {
        case "dataReceived":
            return {
                ...state,
                questions: action.payload,
                status: "ready",
            };
        case "dataFailed":
            return {
                ...state,
                status: "error",
            };
        case "start":
            return {
                ...state,
                status: "active",
                secondsRemaining: state.questions.length * SECS_PER_QUESTION,
            };
        case "newAnswer":
            const question = state.questions.at(state.index);

            return {
                ...state,
                answer: action.payload,
                points:
                    action.payload === question.correctOption
                        ? state.points + question.points
                        : state.points,
            };

        case "nextQuestion":
            return { ...state, answer: null, index: state.index + 1 };

        case "finish":
            return {
                ...state,
                status: "finished",
                highscore:
                    state.points > state.highscore
                        ? state.points
                        : state.highscore,
            };

        case "restart":
            return {
                ...initialState,
                questions: state.questions,
                highscore: state.highscore,
                status: "ready",
            };

        case "tick":
            return {
                ...state,
                secondsRemaining: state.secondsRemaining - 1,
                status:
                    state.secondsRemaining === 0 ? "finished" : state.status,
            };

        default:
            throw new Error("Action is unknown");
    }
}

function QuizProvider() {
    const [
        {
            questions,
            status,
            index,
            answer,
            points,
            highscore,
            secondsRemaining,
        },
        dispatch,
    ] = useReducer(reducer, initialState);
}

function useQuiz() {
    const context = useContext(QuizContext);
    if (context === undefined)
        throw new Error("Quiz context was used outside the QuizProvider!");
    return context;
}

export { QuizProvider, useQuiz };
