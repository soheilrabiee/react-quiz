import { useEffect } from "react";
import Header from "./Header";
import Main from "./Main";

export default function App() {
    useEffect(function () {
        async function getData() {
            try {
                const res = await fetch("http://localhost:9000/questions");
                const data = await res.json();
                if (!res.ok) {
                    throw new Error("Couldn't fetch the data");
                }
                console.log(data);
            } catch (err) {
                console.error(err.message);
            }
        }

        getData();
    }, []);

    return (
        <div className="app">
            <Header />
            <Main>
                <p>1/15</p>
                <p>Question</p>
            </Main>
        </div>
    );
}
