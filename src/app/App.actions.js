import React, {createContext, useContext, useEffect, useState} from "react";

const DEFAULT_STATE = {
    student: {
        name: '',
        email: 'raoul.ardy@gmail.com',
        config: {
            questionRange: {
                from: 1,
                end: 99
            },
            totalSums: 200,
            totalQuestionsEachSum: 6,
            pauseBetweenQuestionsInMs: 1000,
            percentageOfQuestionInNegative: 30,
        },
    },
    sessions: [
        {
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
        }
    ]
};

function reducer(state, action) {
    return state;
}

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


