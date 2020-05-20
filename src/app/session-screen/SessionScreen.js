import React from "react";
import {useParams} from "react-router-dom";
import {useSession} from "../App.actions";
import ReportScreen from "./ReportScreen";
import ExerciseScreen from "./ExerciseScreen";


export default function SessionScreen() {
    const {sessionId} = useParams();
    const currentActiveSession = useSession(sessionId);
    const isDone = currentActiveSession.answers.length === currentActiveSession.questions.length;
    return <>
        {!isDone && <ExerciseScreen currentActiveSession={currentActiveSession}/>}
        {isDone && <ReportScreen session={currentActiveSession}/>}
    </>
}
