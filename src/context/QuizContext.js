const { createContext, useContext, useReducer, useEffect } = require("react");

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

function QuizProvider({ children }) {
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

    const numQuestions = questions.length;
    const maxPossiblePoints = questions.reduce(
        (prev, cur) => prev + cur.points,
        0
    );

    useEffect(function () {
        async function getData() {
            try {
                const res = await fetch("http://localhost:9000/questions");
                const data = await res.json();
                if (!res.ok) {
                    throw new Error("Couldn't fetch the data");
                }
                dispatch({ type: "dataReceived", payload: data });
            } catch (err) {
                dispatch({ type: "dataFailed" });
            }
        }

        getData();
    }, []);

    return (
        <QuizProvider
            value={{
                questions,
                status,
                index,
                answer,
                points,
                highscore,
                secondsRemaining,
                numQuestions,
                maxPossiblePoints,
                dispatch,
            }}
        >
            {children}
        </QuizProvider>
    );
}

function useQuiz() {
    const context = useContext(QuizContext);
    if (context === undefined)
        throw new Error("Quiz context was used outside the QuizProvider!");
    return context;
}

export { QuizProvider, useQuiz };
