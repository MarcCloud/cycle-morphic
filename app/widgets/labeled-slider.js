import { hJSX } from '@cycle/dom';
import isolate from '@cycle/isolate';
import { Observable } from 'rx';

const intent = ({DOM})=> {
    return {
        change$: DOM.select('.slider').events('input').map(ev=> ev.target.value)
    };
};

const model$ = ({props$, actions})=>{
    const initialValues$ = props$.map(props => props.initial).first();
    return {
        props$,
        value$: initialValues$.concat(actions.change$)
    };
};

const view$ = ({props$, value$})=> {
    return Observable.combineLatest(props$, value$, (props, value)=> {
        return <div className="labeled-slider">
                    <span className="label">{props.label + ' ' + value + props.unit}</span>
                    <input className="slider" type="range" min= {props.min} max= {props.max} value= {value}/>
                </div>;
    });
};

const LabeledSlider = ({props$, DOM})=>{
    const state$ = model$({props$, actions: intent({DOM})});
    const sinks = {
        DOM: view$(state$),
        value$: state$.value$
    };
    return sinks;
};
const Component = sources=> isolate(LabeledSlider)(sources);
export default Component;
