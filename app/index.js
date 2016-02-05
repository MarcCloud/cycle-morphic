import { Observable } from 'rx';
import { hJSX } from '@cycle/dom';

const calculateBMI = (weight, height)=> {
   const heightMeters = height * 0.01;
   return Math.round(weight / (heightMeters * heightMeters)) || 0;
};

const WeightSlider = (weight) => {
    return <div><label>Weight: {weight} kg</label><input id="weight" type="range" min="40" max="140" value={weight}/></div>;
};

const HeightSlider = (height) => {
    return <div><label>Height: {height} cm</label><input id="height" type="range" min="140" max="210" value={height}/></div>;
};

const model$ = (actions, context$) => {
    return context$.map(ctx=>{
        return Observable.combineLatest(actions.changeWeight$.startWith(ctx.weight),
                                        actions.changeHeight$.startWith(ctx.height),
                                        (weight, height)=> ({weight, height, bmi: calculateBMI(weight, height)}));
    }).flatMap((state)=>state);
};

const view$ = (state$) => {
    return state$.map(({weight, height, bmi})=>{
        return <div>
                    {WeightSlider(weight)}
                    {HeightSlider(height)}
                    <h2>BMI:{bmi}</h2>
               </div>;
    });
};

const intent = ({DOM})=> {
    return {
        changeWeight$: DOM.select('#weight').events('input').map((ev)=>ev.target.value),
        changeHeight$: DOM.select('#height').events('input').map((ev)=>ev.target.value)
    };
};

const main = ({DOM, context}) => {
    return {
        DOM: view$(model$(intent({DOM}), context))
    };
};

export default main;
