import {applyMiddleware} from 'redux';
import request from './request';
import sync from './sync';
import training from './training';

export default applyMiddleware(request, sync, training);
