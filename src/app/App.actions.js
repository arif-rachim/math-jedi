import React, {createContext, useContext, useEffect, useState} from "react";
import {uuidv4} from "./common/utils";

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
            pauseBetweenQuestionsInMs: 1000,
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
    return () => {
        setState(state => {

            const filteredSessions = state.sessions.filter(s => s.id !== state.student.currentSessionId);

            const session = {
                id: uuidv4(),
                startAt : new Date().toISOString(),
                endAt : null,
                questions : buildQuestions(state.student.config),
                answers : []
            };
            const newState = {student:{...state.student},sessions:[...filteredSessions,session]};
            newState.student.currentSessionId = session.id;
            return newState;
        });
    }
}

export function useCurrentActiveSession(){
    const {state} = useContext(Context);
    const sessions = state?.sessions?.filter(session => session.id === state.student.currentSessionId);
    return sessions?.length > 0 ? sessions[0] : null;
}
