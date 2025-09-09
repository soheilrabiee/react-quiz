import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";

const initialState = {
    questions: [],

    // 'loading', 'error', 'ready', 'active', 'finished'
    status: "loading",
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
        default:
            throw new Error("Action is unknown");
    }
}

export default function App() {
    // Nested destructuring
    const [{ questions, status }, dispatch] = useReducer(reducer, initialState);

    const numQuestions = questions.length;

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
                    <StartScreen numQuestions={numQuestions} />
                )}
            </Main>
        </div>
    );
}
