import { FC } from 'react';
import { Box, CircularProgress } from '@material-ui/core';

const Loader: FC = () => {
    return (
        <Box height="120px" width="100%" display="flex" justifyContent="center" alignItems="center">
            <CircularProgress color="inherit" />
        </Box>
    );
};

export default Loader;
