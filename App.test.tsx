import React from 'react';
import { render } from '@testing-library/react-native';

import App from './App';

describe('App', () => {
    it('should render correctly', () => {
        const { queryByText } = render(<App />);
        expect(queryByText('Open up App.tsx to start working on your app!')).toBeOnTheScreen();
    });
});
