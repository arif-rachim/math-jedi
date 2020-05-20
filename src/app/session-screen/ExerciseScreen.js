import {useAnswer} from "../App.actions";
import React, {useCallback, useEffect, useRef, useState} from "react";
import Horizontal from "../common/Horizontal";
import classes from "./SessionScreen.module.css";
import Page from "../common/Page";
import Grow from "../common/Grow";
import Button from "../common/Button";

const ENTER_KEY = 13;
export default function ExerciseScreen({currentActiveSession}) {

    const questionIndex = currentActiveSession.answers.length;
    const nextQuestionsToBeAnswered = currentActiveSession.questions[questionIndex] || [];
    const setAnswer = useAnswer(currentActiveSession.id, questionIndex);
    const contentRef = useRef();
    const [fontSize, setFontSize] = useState(24);
    const questionStyle = {fontSize};
    const answerRef = useRef();
    useEffect(() => {
        const height = contentRef.current.offsetHeight;
        setFontSize((height - 50) / (nextQuestionsToBeAnswered.length + 1));
    }, [nextQuestionsToBeAnswered.length]);

    const onEnterPressed = useCallback((e) => {
        if (e.keyCode === ENTER_KEY) {
            setAnswer(answerRef.current.value);
        }
    }, [answerRef, setAnswer]);
    useEffect(() => {
        answerRef.current.value = '';
    }, [answerRef, questionIndex]);
    return <Page><label style={{width: '100%', height: '100%'}}>
        <Horizontal style={{height: '100%'}}>
            <div className={classes.content}>
                <div ref={contentRef} className={classes.question} style={questionStyle}>
                    {nextQuestionsToBeAnswered.map(((question, index) => <div key={index}>{question}</div>))}
                </div>
                <input ref={answerRef} type="number" className={classes.number} style={{fontSize: fontSize}}
                       autoFocus={true} min={0} placeholder={'0'} onKeyDown={onEnterPressed}/>
            </div>
            <div style={{width: '30vw', borderLeft: '1px dashed rgba(0,0,0,0.5)'}}/>
        </Horizontal>
    </label>
        <Page.Actions>
            <Grow/>
            <Button onClick={() => setAnswer(answerRef.current.value)}>Next</Button>
        </Page.Actions>
    </Page>;
}
