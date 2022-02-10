import {
    trigger,
    transition,
    style,
    query,
    group,
    animateChild,
    animate,
    keyframes
} from '@angular/animations';

export const fader = trigger('routeAnimations', [
    transition('* <=> *', [
        query(':enter, :leave', [
            style({
                position: 'absolute',
                left: 0,
                width: '100%',
                opacity: 0,
                transform: 'scale(0) translateY(100%)'
            }),
        ], { optional: true }),
        query(':enter', [
            animate('600ms ease', style({
                opacity: 1, transform: 'scale(1) translateY(0)'
            }))
        ], { optional: true }),
    ])
]);

export const slider = trigger('routeAnimations', [
    transition('preference1 => preference2', slideTo('right')),
    transition('preference2 => preference1', slideTo('left')),
    transition('* => preference1', slideTo('right')),

    transition('preference2 => preference3', slideTo('right')),
    transition('preference3 => preference2', slideTo('left')),
    // transition('* => preference2', slideTo('right')),

    transition('preference3 => preference4', slideTo('right')),
    transition('preference4 => preference3', slideTo('left')),
    // transition('* => preference3', slideTo('right')),

    transition('preference4 => preference5', slideTo('right')),
    transition('preference5 => preference4', slideTo('left')),
    // transition('* => preference4', slideTo('right')),
]);

function slideTo(direction: string) {
    const optional = { optional: true };
    return [
        query(':enter, :leave', [
            style({
                position: 'absolute',
                top: 0,
                [direction]: 0,
                width: '100%'
            })
        ], optional),
        query(':enter', [
            style({
                [direction]: '-100%'
            })
        ], optional),
        group([
            query(':leave', [
                animate('300ms ease', style({ [direction]: '100%' }))
            ], optional),
            query(':enter', [
                animate('300ms ease', style({ [direction]: '0%' }))
            ], optional),

        ])

    ];
}