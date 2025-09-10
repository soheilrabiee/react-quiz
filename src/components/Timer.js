import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining }) {
    useEffect(
        function () {
            const id = setInterval(function () {
                dispatch({ type: "tick" });
            }, 1000);

            return () => clearInterval(id);
        },
        [dispatch]
    );

    return <div className="timer">{secondsRemaining}</div>;
}

export default Timer;
