import reducer from './auth';
import * as actionTypes from '../actions/actionTypes';

describe('Auth reducer', () => {
    it('should return initial state', () => {
        expect(reducer(undefined, {})).toEqual({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/',
        });
    });

    it('should return token and userId updated after login.', () => {
        expect(reducer({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/',
        }, {
            type: actionTypes.AUTH_SUCCESS,
            idToken: 'Some-token',
            userId: 'Some-user-id',
        })).toEqual({
            token: 'Some-token',
            userId: 'Some-user-id',
            error: null,
            loading: false,
            authRedirectPath: '/',
        });
    });
});