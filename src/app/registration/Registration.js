import React, {useCallback, useState} from "react";
import Input, {InputNumber} from "../common/Input";
import Page from "../common/Page";
import Button from "../common/Button";
import Grow from "../common/Grow";
import Horizontal from "../common/Horizontal";
import {useNotification} from "../common/Notification";
import Vertical from "../common/Vertical";
import {useStudent, useUpdateConfiguration} from "../App.actions";
import { useHistory } from "react-router-dom";

const DEFAULT_STATE = {
    name: '',
    email: '',
    config: {
        questionsRange: {
            start: 1,
            end: 99
        },
        totalSums: 200,
        totalQuestionsEachSum: 6,
        pauseBetweenQuestionsInMs: 1000,
        percentageOfQuestionInNegative: 30,
    }
};
export default function Registration() {
    const [page, setPage] = useState(1);
    const student = useStudent();
    const [state, setState] = useState(student);
    const notification = useNotification();
    const updateConfiguration = useUpdateConfiguration();
    const history = useHistory();
    const handleChange = useCallback((props) => ({value}) => {
        setState((oldSate) => {
            const newState = {...oldSate};
            const propsArray = props.split('.');
            let propsLength = propsArray.length;
            let pointer = newState;
            propsArray.forEach((prop, index) => {
                if (index < (propsLength - 1)) {
                    pointer = pointer[prop];
                }
            });
            pointer[propsArray[propsArray.length - 1]] = value;
            return newState;
        });
    }, []);
    const nameLength = state?.name?.length;
    const emailLength = state?.email?.length;
    const questionStart = state?.config?.questionsRange?.start;
    const questionEnd = state?.config.questionsRange?.end;
    const totalSums = state?.config?.totalSums;
    const totalQuestionsEachSum = state?.config?.totalQuestionsEachSum;
    const pauseBetweenQuestionsInMs = state?.config?.pauseBetweenQuestionsInMs;
    const percentageOfQuestionInNegative = state?.config?.percentageOfQuestionInNegative;
    const validatePage = useCallback(() => {
        switch (page) {
            case 1 : {
                if (nameLength > 0) {
                    return true;
                }
                notification.error('Name should not be empty');
                return false;
            }
            case 2 : {
                if (emailLength > 0) {
                    return true;
                }
                notification.error('Email should not be empty');
                return false;
            }
            case 3 : {
                if (!(questionStart > 0)) {
                    notification.error('Range `Start value` should be greater than 0');
                    return false;
                }
                if (!(questionEnd > 0)) {
                    notification.error('Range `End value` should be greater than 0');
                    return false;
                }
                if (questionEnd < questionStart) {
                    notification.error('Range `End value` should be greater than `Start value`');
                    return false;
                }
                return true;
            }
            case 4 : {
                if (!(totalSums > 0)) {
                    notification.error('`Total Sums` should be greater than 0');
                    return false;
                }
                return true;
            }
            case 5 : {
                if (!(totalQuestionsEachSum > 0)) {
                    notification.error('`Total Questions each Sums` should be greater than 0');
                    return false;
                }
                return true;
            }
            case 6 : {
                if (!(pauseBetweenQuestionsInMs >= 1000)) {
                    notification.error('`Pause between session` should be greater than 1000');
                    return false;
                }
                return true;
            }
            case 6 : {
                if (!(percentageOfQuestionInNegative >= 0 && percentageOfQuestionInNegative <= 100)) {
                    notification.error('`Percentae of Negative Questions` should be between than 0 to 100');
                    return false;
                }
                return true;
            }
            default : {
                return true;
            }
        }

    }, [emailLength, nameLength, notification, page, pauseBetweenQuestionsInMs, percentageOfQuestionInNegative, questionEnd, questionStart, totalQuestionsEachSum, totalSums]);

    const nextPage = useCallback((next) => {
        if (validatePage()) {
            setPage(page + (next ? 1 : -1));
        }
    }, [page, validatePage]);

    const saveChanges = useCallback(() => {
        updateConfiguration(state);
        history.push("/");
    },[history, state, updateConfiguration]);
    return <Page>
        <Vertical heightFull={true} verticalAlign={'center'}>
            {page === 1 &&
            <Input placeholder={'Name'} autoCaps={false} label={'Enter your Name'} value={state.name}
                   onChange={handleChange('name')}/>
            }
            {page === 2 &&
            <Input type={"email"} autoCaps={false} placeholder={'Email'} label={'Enter your E-Mail'} value={state.email}
                   onChange={handleChange('email')}/>
            }
            {page === 3 &&
            <Horizontal gap={20}>
                <InputNumber label={'Start Range'} value={state?.config?.questionsRange?.start}
                             onChange={handleChange('config.questionsRange.start')}/>
                <InputNumber label={'End Range'} value={state?.config?.questionsRange?.end}
                             onChange={handleChange('config.questionsRange.end')}/>
            </Horizontal>
            }
            {page === 4 &&
            <InputNumber label={'Total Sums'} value={state?.config?.totalSums}
                         onChange={handleChange('config.totalSums')}/>
            }
            {page === 5 &&
            <InputNumber label={'Total Questions Each Sum'} value={state?.config?.totalQuestionsEachSum}
                         onChange={handleChange('config.totalQuestionsEachSum')}/>
            }
            {page === 6 &&
            <InputNumber label={'Pause between Questions in millisecond'}
                         value={state?.config?.pauseBetweenQuestionsInMs}
                         onChange={handleChange('config.pauseBetweenQuestionsInMs')}/>
            }
            {page === 7 &&
            <InputNumber label={'Percentage of Negative Questions'}
                         value={state?.config?.percentageOfQuestionInNegative}
                         onChange={handleChange('config.percentageOfQuestionInNegative')}/>
            }
        </Vertical>
        <Page.Actions align={'center'}>
            {page !== 1 &&
            <Button onClick={() => nextPage(false)}>Back</Button>
            }
            <Grow/>
            {page < 7 &&
                <Button onClick={() => nextPage(true)}>Next</Button>
            }
            {page === 7 &&
            <Button onClick={() => saveChanges()}>Save</Button>
            }
        </Page.Actions>
    </Page>

}
