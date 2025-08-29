import React from 'react';
import log from './log';
import LazyScratchBlocks from './tw-lazy-scratch-blocks';
import LoadingSpinner from '../components/tw-loading-spinner/spinner.jsx';
import CrashMessage from '../components/crash-message/crash-message.jsx';

const LoadScratchBlocksHOC = function (WrappedComponent) {
    class LoadScratchBlocks extends React.Component {
        constructor (props) {
            super(props);
            this.state = {
                loaded: LazyScratchBlocks.isLoaded(),
                error: null
            };
            this._mounted = true;
            this._loadPromise = null;
            
            if (!this.state.loaded) {
                this._loadPromise = LazyScratchBlocks.load()
                    .then(() => {
                        if (this._mounted) {
                            this.setState({
                                loaded: true
                            });
                        }
                    })
                    .catch(e => {
                        log.error(e);
                        if (this._mounted) {
                            this.setState({
                                error: e
                            });
                        }
                    });
            }
        }
        
        componentWillUnmount () {
            this._mounted = false;
            this._loadPromise = null;
        }
        
        handleReload () {
            location.reload();
        }
        
        render () {
            if (this.state.error !== null) {
                return (
                    <CrashMessage
                        errorMessage={`lazy scratch-blocks: ${this.state.error}`}
                        onReload={this.handleReload}
                    />
                );
            }
            if (!this.state.loaded) {
                return (
                    <LoadingSpinner />
                );
            }
            return (
                <WrappedComponent
                    {...this.props}
                />
            );
        }
    }
    return LoadScratchBlocks;
};

export default LoadScratchBlocksHOC;
