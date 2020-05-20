import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {uuidv4} from "./common/utils";
import {useHistory} from 'react-router-dom';

const DEFAULT_STATE = {
    student: {
        name: '',
        email: '',
        config: {
            questionsRange: {
                start: 10,
                end: 99
            },
            totalSums: 200,
            totalQuestionsEachSum: 6,
            percentageOfQuestionInNegative: 30,
        },
        currentSessionId : null
    },
    sessions: [
        /*{
            startAt: '25-JAN-2020T0303020',
            endAt: '25-JAN-2020T03030303',
            questions: [
                [33, 45, 23, 65, 29, 30],
                [78, 25, 33, 23, 132, 33],
                [89, 22, 32, 13, 22, 32]
            ],
            answers: [
                {
                    answer: 332,
                    expected: 782,
                    isCorrect: false,
                    timeTakenInMs: 300,
                    takenAt: '25-JAN-2020T030303',
                    answerAt: '25-JAN-2020T0302032'
                }
            ]
        }*/
    ]
};

const Context = createContext();

export default function AppContextProvider({children}) {
    const [state, setState] = useState(() => {
        if(localStorage.getItem('math-jedi')){
            return JSON.parse(localStorage.getItem('math-jedi'));
        }
        return DEFAULT_STATE;
    });
    useEffect(() =>{
        if(state){
            localStorage.setItem('math-jedi',JSON.stringify(state));
        }
    },[state]);

    return <Context.Provider value={{state, setState}}>
        {children}
    </Context.Provider>
}

export function useStudentIsRegistered() {
    const {state} = useContext(Context);
    return state?.student?.name !== ''
}

export function useStudent(){
    const {state} = useContext(Context);
    return state.student;
}

export function useUpdateConfiguration(){
    const {setState} = useContext(Context);
    return (config) => setState((oldVal) => {
        return {...oldVal,student: config}
    });
}


function buildQuestions({questionsRange:{start,end},totalSums,totalQuestionsEachSum,percentageOfQuestionInNegative}){

    const findNextNumber = ({start,end,percentageOfQuestionInNegative,total,prevNumber}) => {

        const shouldBeNegative = (Math.random() <= (percentageOfQuestionInNegative/100));
        const candidate = Math.round((Math.random() * (end - start)) + start);
        const value = candidate * (shouldBeNegative ?  - 1 : 1);
        if((value + total) < 0){
            return findNextNumber({start,end,percentageOfQuestionInNegative,total,prevNumber});
        }
        if(Math.abs(prevNumber) === candidate ){
            return findNextNumber({start,end,percentageOfQuestionInNegative,total,prevNumber});
        }
        return value;
    };

    const generateSet = ({start,end,percentageOfQuestionInNegative,totalQuestionsEachSum}) => {
        const numbers = [];
        let total = 0;
        let prevNumber = 0;
        for(let i = 0;i< totalQuestionsEachSum;i++){
            const nextNumber = findNextNumber({start,end,percentageOfQuestionInNegative,total,prevNumber});
            prevNumber = nextNumber;
            total = total + nextNumber;
            numbers.push(nextNumber);
        }
        return numbers;
    };

    return  [...Array(totalSums).keys()].map(() => generateSet({totalQuestionsEachSum,percentageOfQuestionInNegative,end,start}));
}

export function useStartNewSession(){
    const {setState} = useContext(Context);
    const history = useHistory();

    return () => {
        const sessionId = uuidv4();
        setState(state => {
            const filteredSessions = state.sessions.filter(s => s.id !== state.student.currentSessionId);
            const session = {
                id: sessionId,
                startAt : new Date().toISOString(),
                endAt : null,
                questions : buildQuestions(state.student.config),
                answers : []
            };
            const newState = {student:{...state.student},sessions:[...filteredSessions,session]};
            newState.student.currentSessionId = session.id;
            return newState;
        });
        history.push(`/session/${sessionId}`);
    }
}

export function useCurrentActiveSession() {
    const {state} = useContext(Context);
    const sessions = state?.sessions?.filter(session => session.id === state.student.currentSessionId);
    return sessions?.length > 0 ? sessions[0] : null;
}

export function useLastSessionId() {
    const {state} = useContext(Context);
    return state.sessions && state.sessions.length > 0 ? state.sessions[state.sessions.length - 1].id : null;
}

export function useSession(sessionId) {
    const {state} = useContext(Context);
    const sessions = state?.sessions?.filter(session => session.id === sessionId);
    return sessions?.length > 0 ? sessions[0] : null;
}

export function useAnswer(sessionId, questionIndex) {
    const {setState} = useContext(Context);
    const startQuestion = new Date();
    return useCallback((answer) => {
        setState((oldState) => {
            const session = oldState.sessions.filter(s => s.id === sessionId)[0];
            if (session && session.questions && session.questions.length > questionIndex) {
                const question = session.questions[questionIndex];
                answer = parseInt(answer);
                const expectedAnswer = question.reduce((acc, next) => acc + next, 0);
                const endQuestion = new Date();
                const answerObject = {
                    answer: answer,
                    expected: expectedAnswer,
                    isCorrect: answer === expectedAnswer,
                    timeTakenInMs: endQuestion.getTime() - startQuestion.getTime(),
                    takenAt: startQuestion.toISOString(),
                    answerAt: endQuestion.toISOString()
                };
                const newSessions = {...session, answers: [...session.answers, answerObject]};
                const isDone = newSessions.questions.length === newSessions.answers.length;
                newSessions.endAt = isDone ? endQuestion.toISOString() : null;
                const sessionIndex = oldState.sessions.indexOf(session);
                return {
                    student: {...oldState.student, currentSessionId: isDone ? null : oldState.student.currentSessionId},
                    sessions: [...oldState.sessions.slice(0, sessionIndex), newSessions, ...oldState.sessions.slice(sessionIndex + 1, oldState.sessions.length)]
                };
            }
            return oldState;
        });
    }, [questionIndex, sessionId, setState, startQuestion]);
}
