import React from "react";
import Page from "../common/Page";
import Button from "../common/Button";
import Grow from "../common/Grow";
import {useHistory} from 'react-router-dom';
import classes from './ReportScreen.module.css';
import Horizontal from "../common/Horizontal";


const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];


function formatDdMmmYyyyHhMmSs(date) {
    const append = (n) => n <= 9 ? `0${n}` : n.toString();
    return `${append(date.getDate())}-${months[date.getMonth() + 1]}-${date.getFullYear()} ${append(date.getHours())}:${append(date.getMinutes())}`
}

const ONE_MINUTE = (1000 * 60);

function convertToTime(time) {
    const minutes = (time / ONE_MINUTE).toFixed(0);
    const seconds = ((time % ONE_MINUTE) / 1000).toFixed(1);
    return `${minutes} Minutes ${seconds} Seconds`
}

export default function ReportScreen({session}) {
    const history = useHistory();

    const timeTaken = session.answers.reduce((acc, next) => acc + next.timeTakenInMs, 0);

    const time = convertToTime(timeTaken);

    return <Page>
        <Horizontal verticalAlign={'bottom'}>
            <div style={{fontSize: '2rem'}}>{time}</div>
            <Grow/>
            <div style={{
                fontSize: '1.5rem'
            }}>{formatDdMmmYyyyHhMmSs(new Date(session.startAt))}</div>
        </Horizontal>
        <div>
            <table className={classes.table}>
                <thead>
                <tr>
                    <td style={{textAlign: 'center'}}>No</td>
                    <td style={{width: '100%', textAlign: 'right', padding: 5}}>Question</td>
                    <td>Total</td>
                    <td>Answer</td>
                    <td style={{whiteSpace: 'nowrap'}}>Time (Seconds)</td>
                </tr>
                </thead>
                <tbody>
                {session.questions.map((question, index) => {
                    const {timeTakenInMs, answer, expected, isCorrect} = session.answers[index];
                    return <tr key={index} data-iscorrect={isCorrect}>
                        <td style={{textAlign: 'center'}}>{index + 1}</td>
                        <td style={{textAlign: 'right'}}>{question.join(', ')}</td>
                        <td style={{textAlign: 'center'}}>{expected}</td>
                        <td style={{textAlign: 'center'}}>{answer}</td>
                        <td style={{
                            textAlign: 'center',
                            whiteSpace: 'nowrap'
                        }}>{`${((timeTakenInMs) / 1000).toFixed(2)}`}</td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>
        <Page.Actions>
            <Grow/>
            <Button onClick={() => history.push('/')}>Home</Button>
        </Page.Actions>
    </Page>
}
