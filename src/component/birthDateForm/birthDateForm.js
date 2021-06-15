import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { Form, Button, Input, Icon, Divider, Message } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import useKeypress from 'react-use-keypress';

import './birthDateForm.css';

export default function BirthDateForm() {
    
    const [diff, setDiff] = useState(null);

    useKeypress(['Escape', 'Enter'], () => {
        setDiff(null);
      });

    return (
        <div className="birth-date-box">
            <div className="header">
                <Icon name="calculator" 
                      size='huge' 
                      circular={true} />
                <h1>Life Time!</h1>
                <Divider horizontal>
                   ...
                </Divider>
            </div>
            {diff ? <AnswerComponent diff={diff} setDiff={setDiff}/> : <QuestionForm setDiff={setDiff}/>}
        </div>
    )
}

function QuestionForm(props) {
    
    const {setDiff} = props;
    const [currentDate, setCurrentDate] = useState(null);
    const [time, setTime] = useState("");
    const [errorDate, setErrorDate] = useState(false);
    const [errorHour, setErrorHour] = useState(false);
    
    const onDatePick = (event, data) => {

        //Corto solo la fecha porque el datePicker no me deja setear hora.
        setCurrentDate(data.value?.toISOString().slice(0, 10));
        setErrorDate(false);
    }

    const onTimeChange = (event, data) => {
        setTime(data.value);
        setErrorHour(false);
    }

    const handleError = (reg_ex) => {
        if(!currentDate){
            setErrorDate(true);
        }
        if(!reg_ex.test(time) || time.toString().length !== 5){
            setErrorHour(true);
    }
}

    const onSubmit = () => {
        const reg_ex = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');
        if(!reg_ex.test(time) || time.toString().length !== 5 || !currentDate){
            handleError(reg_ex);
        } else {
            const today = DateTime.now();
            const birthday = currentDate + 'T' + time;
            const birthdayDateTime = DateTime.fromISO(birthday);
            const timeAgo = today.diff(birthdayDateTime, ['years','months', 'days', 'hours', 'minutes']).toObject()
            console.log(timeAgo);
            setDiff(timeAgo);
        }

      }

    return(
        <Form className="date-form" onSubmit={onSubmit}>
            <Form.Field  width={16}>
                <h3>¿Cual fue tu momento de nacimiento?</h3>
                <div className="date-time-inputs">
                    <SemanticDatepicker iconPosition='left' 
                                        format="DD/MM/YYYY" 
                                        icon="calendar" 
                                        inverted
                                        onChange={onDatePick}
                                        error={errorDate}/>
                    {errorDate && 
                    <>
                        <span>
                        <Icon name= 'warning circle' color='yellow'/>
                            Debes ingresar una fecha válida</span>
                    </>}
                </div>
                <div className="input-hour">
                    <Input iconPosition='left' 
                            placeholder="00:00" 
                            icon="clock" 
                            onChange={onTimeChange}
                            error={errorHour}/>
                    {errorHour && 
                    <>
                        <span>
                        <Icon name='warning circle' color='yellow'/>
                            Debes ingresar un horario válido</span>
                    </>}
                </div>
            </Form.Field>
            <Button className="button" 
                    type="submit">
                Calcular!
            </Button>
        </Form>
    )
}

function AnswerComponent(props) {

    const {diff, setDiff} = props;

    const minutes = diff.minutes.toFixed(0)

    const handleDismiss = () => {
        setDiff(null);
    }

    const message= `Pasaron ${diff.years} años, ${diff.months} meses, ${diff.days} dias, ${diff.hours} horas y ${minutes} minutos`



    return (
        <>
            <Message icon onDismiss={handleDismiss}>
                <Icon name='info' className="message-icon" size="tiny"/>
                <Message.Content>
                    {message}
                </Message.Content>
            </Message> 
        </>

    )
}
