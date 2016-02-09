import { Observable } from 'rx';
import { hJSX } from '@cycle/dom';
import LabeledSlider from './widgets/labeled-slider';

const calculateBMI = (weight, height)=> {
   const heightMeters = height * 0.01;
   return Math.round(weight / (heightMeters * heightMeters)) || 0;
};

const model$ = (actions) => {
    return Observable.combineLatest(actions.changeWeight$,
                                        actions.changeHeight$,
                                        (weight, height)=> ({weight, height, bmi: calculateBMI(weight, height)}));
};

const view$ = (state$, components) => {
    return state$.combineLatest(components.WeightSlider, components.HeightSlider, (state, weightSlider, heightSlider)=>{
        return <div>
                    {weightSlider}
                    {heightSlider}
                    <h2>BMI:{state.bmi}</h2>
               </div>;
    });
};

const intent = (weightActions, heightActions)=> {
    return {
        changeWeight$: weightActions,
        changeHeight$: heightActions
    };
};

const main = ({DOM, context}) => {
    const weightProps$ = Observable.just({label: 'Weight', min: 40, max: 140, unit: 'kg', initial: context.weight});
    const heightProps$ = Observable.just({label: 'Height', min: 140, max: 210, unit: 'cm', initial: context.height});
    const weightSlider = LabeledSlider({DOM, props$: weightProps$});
    const heightSlider = LabeledSlider({DOM, props$: heightProps$});
    const state$ = model$(intent(weightSlider.value$, heightSlider.value$));
    return {
        DOM: view$(state$, {WeightSlider: weightSlider.DOM, HeightSlider: heightSlider.DOM })
    };
};

export default main;
