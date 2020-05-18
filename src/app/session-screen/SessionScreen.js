import React, {useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import {useSession, useStudent} from "../App.actions";
import classes from "./SessionScreen.module.css";
import Page from "../common/Page";
import Button from "../common/Button";
import Grow from "../common/Grow";

export default function SessionScreen() {
    const {sessionId} = useParams();
    const currentActiveSession = useSession(sessionId);
    const student = useStudent();
    const pauseBetweenQuestionsInMs = student.config.pauseBetweenQuestionsInMs;
    const lastAnsweredIndex = currentActiveSession.answers.length;
    const nextQuestionsToBeAnswered = currentActiveSession.questions[lastAnsweredIndex];
    const questionBoxRef = useRef();

    useEffect(() => {
        let index = 0;
        questionBoxRef.current.innerText = nextQuestionsToBeAnswered[index++];
        if (index === nextQuestionsToBeAnswered.length) {
            return;
        }
        const intervalId = setInterval(() => {
            questionBoxRef.current.innerText = nextQuestionsToBeAnswered[index++];
            if (index === nextQuestionsToBeAnswered.length) {
                clearInterval(intervalId);
            }
        }, pauseBetweenQuestionsInMs);
        return () => clearInterval(intervalId);
    }, [nextQuestionsToBeAnswered]);

    return <Page>
        <div className={classes.content}>
            <div ref={questionBoxRef} className={classes.questionBox}/>
        </div>
        <Page.Actions>
            <Grow/>
            <Button>Pause</Button>
        </Page.Actions>
    </Page>
}
