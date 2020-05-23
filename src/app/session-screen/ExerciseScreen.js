import {useAnswer} from "../App.actions";
import React, {useCallback, useEffect, useRef, useState} from "react";
import Horizontal from "../common/Horizontal";
import classes from "./SessionScreen.module.css";
import Page from "../common/Page";
import Grow from "../common/Grow";
import Button from "../common/Button";
import ProgressPie from "./ProgressPie";

const ENTER_KEY = 13;

export default function ExerciseScreen({currentActiveSession}) {

    const questionIndex = currentActiveSession.answers.length;
    const nextQuestionsToBeAnswered = currentActiveSession.questions[questionIndex] || [];
    const setAnswer = useAnswer(currentActiveSession.id, questionIndex);

    const contentRef = useRef();
    const [fontSize, setFontSize] = useState(24);
    const questionStyle = {fontSize};
    const answerRef = useRef();
    const nextQuestionsToBeAnsweredLength = nextQuestionsToBeAnswered.length;
    useEffect(() => {

        const updateFontSize = (height) => {
            setFontSize((height * 0.8) / (nextQuestionsToBeAnsweredLength + 1));
        };

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                updateFontSize(entry.contentRect.height);
            }
        });
        resizeObserver.observe(contentRef.current);
        return () => {
            resizeObserver.unobserve(contentRef.current);
        }
    }, [nextQuestionsToBeAnsweredLength]);

    const onEnterPressed = useCallback((e) => {
        if (e.keyCode === ENTER_KEY) {
            setAnswer(answerRef.current.value);
        }
    }, [answerRef, setAnswer]);
    useEffect(() => {
        answerRef.current.value = '';
    }, [answerRef, questionIndex]);

    const [answerValue, setAnswerValue] = useState(false);
    const expectedAnswer = nextQuestionsToBeAnswered.reduce((acc, next) => acc + next);
    return <Page><label style={{width: '100%', height: '100%'}}>
        <Horizontal style={{height: '100%'}}>
            <div ref={contentRef} className={classes.content}>
                <div style={{height: '100%', overflow: 'auto'}}>
                    <div className={classes.question} style={questionStyle}>
                        {nextQuestionsToBeAnswered.map(((question, index) => <div key={index}>{question}</div>))}
                    </div>
                </div>
                <input ref={answerRef} type="number" className={classes.number} style={{
                    fontSize: fontSize,
                    backgroundColor: answerValue === expectedAnswer ? '#138584' : 'unset',
                    color: answerValue === expectedAnswer ? 'white' : 'unset',
                }}
                       autoFocus={true} min={0} placeholder={'0'} onKeyDown={onEnterPressed}
                       onChange={(e) => setAnswerValue(parseInt(e.target.value))}
                       value={answerValue}
                />
            </div>
            <div style={{width: '30vw', borderLeft: '1px dashed rgba(0,0,0,0.5)'}}/>
            <ProgressPie style={{top: 10, left: 10}}
                         value={(questionIndex * 100) / currentActiveSession.questions.length}/>
        </Horizontal>
    </label>
        <Page.Actions>
            <Grow/>
            <Button onClick={() => setAnswer(answerRef.current.value)}>Next</Button>
        </Page.Actions>
    </Page>;
}
