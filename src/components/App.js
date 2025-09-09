import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";

const initialState = {
    questions: [],

    // 'loading', 'error', 'ready', 'active', 'finished'
    status: "loading",
    // Question index
    index: 0,
    answer: null,
    points: 0,
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
            return { ...state, status: "active" };
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

        default:
            throw new Error("Action is unknown");
    }
}

export default function App() {
    // Nested destructuring
    const [{ questions, status, index, answer, points }, dispatch] = useReducer(
        reducer,
        initialState
    );

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
        <div className="app">
            <Header />
            <Main>
                {status === "loading" && <Loader />}
                {status === "error" && <Error />}
                {status === "ready" && (
                    <StartScreen
                        numQuestions={numQuestions}
                        dispatch={dispatch}
                    />
                )}
                {status === "active" && (
                    <>
                        <Progress
                            index={index}
                            numQuestions={numQuestions}
                            points={points}
                            maxPossiblePoints={maxPossiblePoints}
                            answer={answer}
                        />
                        <Question
                            question={questions[index]}
                            dispatch={dispatch}
                            answer={answer}
                        />
                        <NextButton dispatch={dispatch} answer={answer} />
                    </>
                )}
            </Main>
        </div>
    );
}
