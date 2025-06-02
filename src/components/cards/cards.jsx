import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import Draggable from 'react-draggable';

import styles from './card.css';

import shrinkIcon from './icon--shrink.svg';
import expandIcon from './icon--expand.svg';

import rightArrow from './icon--next.svg';
import leftArrow from './icon--prev.svg';

import helpIcon from '../../lib/assets/icon--tutorials.svg';
import closeIcon from './icon--close.svg';
import {
    Play,
    Pause,
    Rewind,
    FastForward,
    Volume2,
    VolumeX,
    Maximize2
} from 'lucide-react';

import {translateVideo} from '../../lib/libraries/decks/translate-video.js';
import {translateImage} from '../../lib/libraries/decks/translate-image.js';

const CardHeader = ({onCloseCards, onShrinkExpandCards, onShowAll, totalSteps, step, expanded}) => (
    <div className={expanded ? styles.headerButtons : classNames(styles.headerButtons, styles.headerButtonsHidden)}>
        <div
            className={styles.allButton}
            onClick={onShowAll}
        >
            <img
                className={styles.helpIcon}
                src={helpIcon}
            />
            <FormattedMessage
                defaultMessage="Tutorials"
                description="Title for button to return to tutorials library"
                id="gui.cards.all-tutorials"
            />
        </div>
        {totalSteps > 1 ? (
            <div className={styles.stepsList}>
                {Array(totalSteps).fill(0)
                    .map((_, i) => (
                        <div
                            className={i === step ? styles.activeStepPip : styles.inactiveStepPip}
                            key={`pip-step-${i}`}
                        />
                    ))}
            </div>
        ) : null}
        <div className={styles.headerButtonsRight}>
            <div
                className={styles.shrinkExpandButton}
                onClick={onShrinkExpandCards}
            >
                <img
                    draggable={false}
                    src={expanded ? shrinkIcon : expandIcon}
                />
                {expanded ?
                    <FormattedMessage
                        defaultMessage="Shrink"
                        description="Title for button to shrink how-to card"
                        id="gui.cards.shrink"
                    /> :
                    <FormattedMessage
                        defaultMessage="Expand"
                        description="Title for button to expand how-to card"
                        id="gui.cards.expand"
                    />
                }
            </div>
            <div
                className={styles.removeButton}
                onClick={onCloseCards}
            >
                <img
                    className={styles.closeIcon}
                    src={closeIcon}
                />
                <FormattedMessage
                    defaultMessage="Close"
                    description="Title for button to close how-to card"
                    id="gui.cards.close"
                />
            </div>
        </div>
    </div>
);

class VideoStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            volume: 100,
            isMuted: false,
            isFullScreen: false,
            controlsVisible: true,
            playerReady: false
        };
        
        this.playerRef = null;
        this.containerRef = React.createRef();
        this.controlsTimeoutRef = null;
        this.progressInterval = null;
        this.progressBarRef = React.createRef();

    }

    componentDidMount() {
        const griffVideo = (this.props.video).includes("griff-");
        
        if (griffVideo) {
            // Load YouTube IFrame API for YouTube videos
            if (!window.YT) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                document.body.appendChild(tag);
                window.onYouTubeIframeAPIReady = this.createPlayer.bind(this);
            } else if (window.YT && window.YT.Player) {
                this.createPlayer();
            }

            // Start progress polling for YouTube
this.progressInterval = setInterval(() => {
    if (this.playerRef && this.playerRef.getCurrentTime && this.state.playerReady) {
        const currentTime = this.playerRef.getCurrentTime();
        const duration = this.playerRef.getDuration() || 0;
        
        this.setState({ currentTime, duration });
        
        // Update CSS custom property for smooth animation
        if (this.progressBarRef && this.progressBarRef.current && duration > 0) {
            const percentage = Math.min((currentTime / duration) * 100, 100);
            this.progressBarRef.current.style.setProperty('--progress', `${percentage}%`);
        }
    }
}, 250);
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);

            this.startControlsTimer();
        } else {
            // Original Wistia code for non-YouTube videos
            const script = document.createElement('script');
            script.src = `https://fast.wistia.com/embed/medias/${this.props.video}.jsonp`;
            script.async = true;
            script.setAttribute('id', 'wistia-video-content');
            document.body.appendChild(script);

            const script2 = document.createElement('script');
            script2.src = 'https://fast.wistia.com/assets/external/E-v1.js';
            script2.async = true;
            script2.setAttribute('id', 'wistia-video-api');
            document.body.appendChild(script2);
        }

    }

    componentDidUpdate(prevProps) {
        if (!(this.props.video).includes("griff-") && !(prevProps.video).includes("griff-")) {
            // Original Wistia update logic
            if (!(window.Wistia && window.Wistia.api)) return;

            const video = window.Wistia.api(prevProps.video);

            if (prevProps.video !== this.props.video) {
                video.replaceWith(this.props.video);
            }

            if (!this.props.expanded) {
                video.pause();
            }
        } else if ((this.props.video).includes("griff-")) {
            // Handle YouTube video updates
            if (prevProps.video !== this.props.video) {
                this.createPlayer();
            }
            
            // Pause YouTube video if modal is being shrunken
            if (!this.props.expanded && this.playerRef) {
                this.playerRef.pauseVideo();
            }
        }
    }

    componentWillUnmount() {
        const griffVideo = (this.props.video).includes("griff-");
        
        if (griffVideo) {
            // Cleanup YouTube player
            if (this.playerRef) {
                this.playerRef.destroy();
            }
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
            }
            if (this.controlsTimeoutRef) {
                clearTimeout(this.controlsTimeoutRef);
            }
                document.removeEventListener('fullscreenchange', this.handleFullscreenChange);

        } else {
            // Original Wistia cleanup
            const script = document.getElementById('wistia-video-content');
            if (script) script.parentNode.removeChild(script);

            const script2 = document.getElementById('wistia-video-api');
            if (script2) script2.parentNode.removeChild(script2);
        }
    }

createPlayer = () => {
    const griffVideo = (this.props.video).includes("griff-");
    const griffVid = (this.props.video).substring(6, this.props.video.length);
    
    if (griffVideo) {
        if (this.playerRef) {
            this.playerRef.destroy();
        }

        this.playerRef = new window.YT.Player('yt-player-custom', {
            videoId: griffVid,
            playerVars: {
                autoplay: 0,
                controls: 0,        // Disable YouTube controls
                disablekb: 1,       // Disable keyboard controls
                modestbranding: 1,  // Remove YouTube branding
                rel: 0,             // Don't show related videos
                fs: 0,              // Disable fullscreen button
                playsinline: 1,     // Play inline on mobile
                iv_load_policy: 3,  // Disable annotations
                cc_load_policy: 0,  // Disable captions by default
                showinfo: 0         // Hide video info
            },
            events: {
                onReady: (event) => {
                    this.setState({
                        duration: event.target.getDuration(),
                        playerReady: true
                    });
                    
                    // Additional step to disable interactions
                    const iframe = document.querySelector('#yt-player-custom iframe');
                    if (iframe) {
                        iframe.style.pointerEvents = 'none';
                    }
                },
                onStateChange: (event) => {
                    this.setState({
                        isPlaying: event.data === window.YT.PlayerState.PLAYING
                    });
                }
            }
        });
    }
}

    startControlsTimer = () => {
        if (this.controlsTimeoutRef) {
            clearTimeout(this.controlsTimeoutRef);
        }
        
        this.controlsTimeoutRef = setTimeout(() => {
            this.setState({ controlsVisible: false });
        }, 3000);
    }

    showControls = () => {
        this.setState({ controlsVisible: true });
        this.startControlsTimer();
    }

    togglePlay = (e) => {
        if (e) e.stopPropagation();
        if (!this.playerRef) return;
        
        if (this.state.isPlaying) {
            this.playerRef.pauseVideo();
        } else {
            this.playerRef.playVideo();
        }
        this.startControlsTimer();
    }

    skipForward = (e) => {
        e.stopPropagation();
        if (!this.playerRef) return;
        const time = this.playerRef.getCurrentTime() + 10;
        this.playerRef.seekTo(time, true);
        this.startControlsTimer();
    }

    skipBackward = (e) => {
        e.stopPropagation();
        if (!this.playerRef) return;
        const time = Math.max(this.playerRef.getCurrentTime() - 10, 0);
        this.playerRef.seekTo(time, true);
        this.startControlsTimer();
    }

handleProgressBarClick = (e) => {
    if (!this.playerRef || !this.state.duration) return;
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = percent * this.state.duration;
    
    this.playerRef.seekTo(newTime, true);
    this.setState({ currentTime: newTime });
    this.startControlsTimer();
}

    toggleMute = (e) => {
        e.stopPropagation();
        if (!this.playerRef) return;
        
        if (this.state.isMuted) {
            this.playerRef.unMute();
            this.playerRef.setVolume(this.state.volume);
        } else {
            this.playerRef.mute();
        }
        this.setState({ isMuted: !this.state.isMuted });
        this.startControlsTimer();
    }

handleVolumeChange = (e) => {
    e.stopPropagation();
    const newVolume = parseInt(e.target.value, 10);
    this.setState({ volume: newVolume });
    
    if (this.playerRef) {
        if (newVolume === 0) {
            this.playerRef.mute();
            this.setState({ isMuted: true });
        } else {
            if (this.state.isMuted) {
                this.playerRef.unMute();
                this.setState({ isMuted: false });
            }
            this.playerRef.setVolume(newVolume);
        }
    }
    this.startControlsTimer();
}

 toggleFullScreen = (e) => {
    e.stopPropagation();
    
    const videoContainer = this.containerRef.current;
    if (!videoContainer) return;
    
    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen().then(() => {
            // Add fullscreen styles
            videoContainer.style.width = '100vw';
            videoContainer.style.height = '100vh';
            videoContainer.style.position = 'fixed';
            videoContainer.style.top = '0';
            videoContainer.style.left = '0';
            videoContainer.style.zIndex = '9999';
            
            // Resize YouTube player for fullscreen
            if (this.playerRef && this.playerRef.getIframe) {
                const iframe = this.playerRef.getIframe();
                iframe.style.width = '100%';
                iframe.style.height = '100%';
            }
            
            this.setState({ isFullScreen: true });
        }).catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen().then(() => {
            // Remove fullscreen styles
            videoContainer.style.width = '466px';
            videoContainer.style.height = '257px';
            videoContainer.style.position = 'relative';
            videoContainer.style.top = 'auto';
            videoContainer.style.left = 'auto';
            videoContainer.style.zIndex = 'auto';
            
            // Resize YouTube player back to normal
            if (this.playerRef && this.playerRef.getIframe) {
                const iframe = this.playerRef.getIframe();
                iframe.style.width = '466px';
                iframe.style.height = '257px';
            }
            
            this.setState({ isFullScreen: false });
        }).catch(err => {
            console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
    }
    this.startControlsTimer();
}

    handleFullscreenChange = () => {
    if (!document.fullscreenElement && this.state.isFullScreen) {
        // User exited fullscreen via ESC key
        const videoContainer = this.containerRef.current;
        if (videoContainer) {
            videoContainer.style.width = '466px';
            videoContainer.style.height = '257px';
            videoContainer.style.position = 'relative';
            videoContainer.style.top = 'auto';
            videoContainer.style.left = 'auto';
            videoContainer.style.zIndex = 'auto';
            
            if (this.playerRef && this.playerRef.getIframe) {
                const iframe = this.playerRef.getIframe();
                iframe.style.width = '466px';
                iframe.style.height = '257px';
            }
        }
        this.setState({ isFullScreen: false });
    }
}

    formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    render() {
        const griffVideo = (this.props.video).includes("griff-");
        const griffVid = (this.props.video).substring(6, this.props.video.length);
        
// In your VideoStep render method for griffVideo, replace the existing return with this:

// Replace your existing VideoStep render method's griffVideo section with this:

if (griffVideo) {
    return (
        <div className={styles.stepVideo}>
            <div 
                ref={this.containerRef}
                className="relative bg-black rounded-lg overflow-hidden"
                style={{
                    width: "466px", 
                    height: "257px", 
                    margin: "0 auto"
                }} 
                onMouseMove={this.showControls}
                onMouseEnter={this.showControls}
                onMouseLeave={() => {
                    if (!this.state.isPlaying) {
                        this.setState({ controlsVisible: false });
                    }
                }}
                onTouchStart={this.showControls}
            >
                {/* YouTube iframe player - COMPLETELY DISABLED FOR INTERACTION */}
                <div 
                    id="yt-player-custom" 
                    className="absolute inset-0"
                    style={{
                        width: "466px", 
                        height: "257px",
                        pointerEvents: "none", // Prevent any YouTube interactions
                        userSelect: "none", // Prevent text selection
                        zIndex: 1 // Lower z-index than security layer
                    }}
                ></div>

                {/* SECURITY LAYER: Complete interaction blocker */}
                <div 
                    className="absolute inset-0"
                    style={{
                        background: 'transparent',
                        cursor: 'pointer',
                        zIndex: 5 // Below controls overlay (which is z-20) but above iframe
                    }}
                    onClick={this.togglePlay}
                    onDoubleClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.toggleFullScreen(e);
                    }}
                    onContextMenu={(e) => {
                        e.preventDefault(); // Prevent right-click menu
                        return false;
                    }}
                    onMouseDown={(e) => {
                        // Allow our own clicks to pass through
                        e.stopPropagation();
                    }}
                ></div>

                {/* Custom Controls Overlay */}
                <div 
                    className={`video-controls-overlay ${this.state.controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}
                    style={{ zIndex: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={() => {
                        this.setState({ controlsVisible: true });
                        if (this.controlsTimeoutRef) {
                            clearTimeout(this.controlsTimeoutRef);
                        }
                    }}
                >
                    {/* Progress Bar */}
                    <div 
                        ref={this.progressBarRef}
                        className="progress-bar-container"
                        onClick={this.handleProgressBarClick}
                        style={{
                            position: 'relative',
                            cursor: 'pointer',
                            borderRadius: '2px',
                            marginBottom: '12px',
                            width: '100%',
                            height: '4px',
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            '--progress': '0%'
                        }}
                    >
                        {/* Progress fill */}
                        <div
                            className="progress-fill"
                            style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                height: '100%',
                                borderRadius: '2px',
                                backgroundColor: '#ff4444',
                                width: 'var(--progress)',
                                transition: 'width 0.2s ease-out'
                            }}
                        />
                        
                        {/* Progress handle */}
                        <div
                            className="progress-handle"
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: 'var(--progress)',
                                transform: 'translate(-50%, -50%)',
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#ff4444',
                                borderRadius: '50%',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                opacity: '0',
                                transition: 'opacity 0.2s ease-out, left 0.2s ease-out',
                                pointerEvents: 'none'
                            }}
                        />
                    </div>

                    {/* Controls Container */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '12px 16px' 
                    }}>
                        {/* Left Side Controls */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px' 
                        }}>
                            {/* Play/Pause Button */}
                            <button 
                                className="video-control-button"
                                onClick={this.togglePlay}
                                style={{ 
                                    padding: '8px', 
                                    borderRadius: '50%',
                                    minWidth: '36px',
                                    minHeight: '36px'
                                }}
                            >
                                {this.state.isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </button>
                            
                            {/* Skip Controls */}
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px' 
                            }}>
                                <button 
                                    className="video-control-button"
                                    onClick={this.skipBackward}
                                    style={{ 
                                        padding: '6px', 
                                        borderRadius: '50%',
                                        minWidth: '32px',
                                        minHeight: '32px'
                                    }}
                                >
                                    <Rewind size={16} />
                                </button>
                                
                                <button 
                                    className="video-control-button"
                                    onClick={this.skipForward}
                                    style={{ 
                                        padding: '6px', 
                                        borderRadius: '50%',
                                        minWidth: '32px',
                                        minHeight: '32px'
                                    }}
                                >
                                    <FastForward size={16} />
                                </button>
                            </div>

                            {/* Time Display */}
                            <span className="video-time-display" style={{ marginLeft: '8px' }}>
                                {this.formatTime(this.state.currentTime)} / {this.formatTime(this.state.duration)}
                            </span>
                        </div>

                        {/* Right Side Controls */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px' 
                        }}>
                            {/* Volume Controls */}
                            <div className="video-volume-container">
                                <button 
                                    className="video-control-button"
                                    onClick={this.toggleMute}
                                    style={{ 
                                        padding: '6px', 
                                        borderRadius: '50%',
                                        minWidth: '32px',
                                        minHeight: '32px'
                                    }}
                                >
                                    {this.state.isMuted || this.state.volume === 0 ? 
                                        <VolumeX size={16} /> : 
                                        <Volume2 size={16} />
                                    }
                                </button>
                                
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={this.state.isMuted ? 0 : this.state.volume} 
                                    onChange={this.handleVolumeChange}
                                    onClick={(e) => e.stopPropagation()}
                                    className="video-volume-slider"
                                    style={{
                                        background: `linear-gradient(to right, #ff4444 0%, #ff4444 ${this.state.isMuted ? 0 : this.state.volume}%, rgba(255,255,255,0.3) ${this.state.isMuted ? 0 : this.state.volume}%, rgba(255,255,255,0.3) 100%)`
                                    }}
                                />
                            </div>
                            
                            {/* Fullscreen Button */}
                            <button 
                                className="video-control-button"
                                onClick={this.toggleFullScreen}
                                style={{ 
                                    padding: '6px', 
                                    borderRadius: '50%',
                                    minWidth: '32px',
                                    minHeight: '32px'
                                }}
                            >
                                <Maximize2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading indicator */}
                {!this.state.playerReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-15">
                        <div className="text-white">Loading...</div>
                    </div>
                )}
            </div>
        </div>
    );
}
        else {
            // Original Wistia video rendering
            return (
                <div className={styles.stepVideo}>
                    <div
                        className={`wistia_embed wistia_async_${this.props.video}`}
                        id="video-div"
                        style={{height: `257px`, width: `466px`}}
                    >
                        &nbsp;
                    </div>
                </div>
            );
        }
    }
}

VideoStep.propTypes = {
    expanded: PropTypes.bool.isRequired,
    video: PropTypes.string.isRequired
};

const ImageStep = ({title, image}) => (
    <Fragment>
        <div className={styles.stepTitle}>
            {title}
        </div>
        <div className={styles.stepImageContainer}>
            <img
                className={styles.stepImage}
                draggable={false}
                key={image} /* Use src as key to prevent hanging around on slow connections */
                src={image}
            />
        </div>
    </Fragment>
);

ImageStep.propTypes = {
    image: PropTypes.string.isRequired,
    title: PropTypes.node.isRequired
};

const NextPrevButtons = ({isRtl, onNextStep, onPrevStep, expanded}) => (
    <Fragment>
        {onNextStep ? (
            <div>
                <div className={expanded ? (isRtl ? styles.leftCard : styles.rightCard) : styles.hidden} />
                <div
                    className={expanded ? (isRtl ? styles.leftButton : styles.rightButton) : styles.hidden}
                    onClick={onNextStep}
                >
                    <img
                        draggable={false}
                        src={isRtl ? leftArrow : rightArrow}
                    />
                </div>
            </div>
        ) : null}
        {onPrevStep ? (
            <div>
                <div className={expanded ? (isRtl ? styles.rightCard : styles.leftCard) : styles.hidden} />
                <div
                    className={expanded ? (isRtl ? styles.rightButton : styles.leftButton) : styles.hidden}
                    onClick={onPrevStep}
                >
                    <img
                        draggable={false}
                        src={isRtl ? rightArrow : leftArrow}
                    />
                </div>
            </div>
        ) : null}
    </Fragment>
);

NextPrevButtons.propTypes = {
    expanded: PropTypes.bool.isRequired,
    isRtl: PropTypes.bool,
    onNextStep: PropTypes.func,
    onPrevStep: PropTypes.func
};
CardHeader.propTypes = {
    expanded: PropTypes.bool.isRequired,
    onCloseCards: PropTypes.func.isRequired,
    onShowAll: PropTypes.func.isRequired,
    onShrinkExpandCards: PropTypes.func.isRequired,
    step: PropTypes.number,
    totalSteps: PropTypes.number
};

const PreviewsStep = ({deckIds, content, onActivateDeckFactory, onShowAll}) => (
    <Fragment>
        <div className={styles.stepTitle}>
            <FormattedMessage
                defaultMessage="More things to try!"
                description="Title card with more things to try"
                id="gui.cards.more-things-to-try"
            />
        </div>
        <div className={styles.decks}>
            {deckIds.slice(0, 2).map(id => (
                <div
                    className={styles.deck}
                    key={`deck-preview-${id}`}
                    onClick={onActivateDeckFactory(id)}
                >
                    <img
                        className={styles.deckImage}
                        draggable={false}
                        src={content[id].img}
                    />
                    <div className={styles.deckName}>{content[id].name}</div>
                </div>
            ))}
        </div>
        <div className={styles.seeAll}>
            <div
                className={styles.seeAllButton}
                onClick={onShowAll}
            >
                <FormattedMessage
                    defaultMessage="See more"
                    description="Title for button to see more in how-to library"
                    id="gui.cards.see-more"
                />
            </div>
        </div>
    </Fragment>
);

PreviewsStep.propTypes = {
    content: PropTypes.shape({
        id: PropTypes.shape({
            name: PropTypes.node.isRequired,
            img: PropTypes.string.isRequired,
            steps: PropTypes.arrayOf(PropTypes.shape({
                title: PropTypes.node,
                image: PropTypes.string,
                video: PropTypes.string,
                deckIds: PropTypes.arrayOf(PropTypes.string)
            }))
        })
    }).isRequired,
    deckIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    onActivateDeckFactory: PropTypes.func.isRequired,
    onShowAll: PropTypes.func.isRequired
};

const Cards = props => {
    const {
        activeDeckId,
        content,
        dragging,
        isRtl,
        locale,
        onActivateDeckFactory,
        onCloseCards,
        onShrinkExpandCards,
        onDrag,
        onStartDrag,
        onEndDrag,
        onShowAll,
        onNextStep,
        onPrevStep,
        showVideos,
        step,
        expanded,
        ...posProps
    } = props;
    let {x, y} = posProps;

    if (activeDeckId === null) return;

    // Tutorial cards need to calculate their own dragging bounds
    // to allow for dragging the cards off the left, right and bottom
    // edges of the workspace.
    const cardHorizontalDragOffset = 400; // ~80% of card width
    const cardVerticalDragOffset = expanded ? 257 : 0; // ~80% of card height, if expanded
    const menuBarHeight = 48; // TODO: get pre-calculated from elsewhere?
    const wideCardWidth = 500;

    if (x === 0 && y === 0) {
        // initialize positions
        x = isRtl ? (-190 - wideCardWidth - cardHorizontalDragOffset) : 292;
        x += cardHorizontalDragOffset;
        // The tallest cards are about 320px high, and the default position is pinned
        // to near the bottom of the blocks palette to allow room to work above.
        const tallCardHeight = 320;
        const bottomMargin = 60; // To avoid overlapping the backpack region
        y = window.innerHeight - tallCardHeight - bottomMargin - menuBarHeight;
    }

    const steps = content[activeDeckId].steps;

    return (
        // Custom overlay to act as the bounding parent for the draggable, using values from above
        <div
            className={styles.cardContainerOverlay}
            style={{
                width: `${window.innerWidth + (2 * cardHorizontalDragOffset)}px`,
                height: `${window.innerHeight - menuBarHeight + cardVerticalDragOffset}px`,
                top: `${menuBarHeight}px`,
                left: `${-cardHorizontalDragOffset}px`
            }}
        >
            <Draggable
                bounds="parent"
                cancel="#video-div" // disable dragging on video div
                position={{x: x, y: y}}
                onDrag={onDrag}
                onStart={onStartDrag}
                onStop={onEndDrag}
            >
                <div className={styles.cardContainer}>
                    <div className={styles.card}>
                        <CardHeader
                            expanded={expanded}
                            step={step}
                            totalSteps={steps.length}
                            onCloseCards={onCloseCards}
                            onShowAll={onShowAll}
                            onShrinkExpandCards={onShrinkExpandCards}
                        />
                        <div className={expanded ? styles.stepBody : styles.hidden}>
                            {steps[step].deckIds ? (
                                <PreviewsStep
                                    content={content}
                                    deckIds={steps[step].deckIds}
                                    onActivateDeckFactory={onActivateDeckFactory}
                                    onShowAll={onShowAll}
                                />
                            ) : (
                                steps[step].video ? (
                                    showVideos ? (
                                        <VideoStep
                                            dragging={dragging}
                                            expanded={expanded}
                                            video={translateVideo(steps[step].video, locale)}
                                        />
                                    ) : ( // Else show the deck image and title
                                        <ImageStep
                                            image={content[activeDeckId].img}
                                            title={content[activeDeckId].name}
                                        />
                                    )
                                ) : (
                                    <ImageStep
                                        image={translateImage(steps[step].image, locale)}
                                        title={steps[step].title}
                                    />
                                )
                            )}
                            {steps[step].trackingPixel && steps[step].trackingPixel}
                        </div>
                        <NextPrevButtons
                            expanded={expanded}
                            isRtl={isRtl}
                            onNextStep={step < steps.length - 1 ? onNextStep : null}
                            onPrevStep={step > 0 ? onPrevStep : null}
                        />
                    </div>
                </div>
            </Draggable>
        </div>
    );
};

Cards.propTypes = {
    activeDeckId: PropTypes.string.isRequired,
    content: PropTypes.shape({
        id: PropTypes.shape({
            name: PropTypes.node.isRequired,
            img: PropTypes.string.isRequired,
            steps: PropTypes.arrayOf(PropTypes.shape({
                title: PropTypes.node,
                image: PropTypes.string,
                video: PropTypes.string,
                deckIds: PropTypes.arrayOf(PropTypes.string)
            }))
        })
    }),
    dragging: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    isRtl: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    onActivateDeckFactory: PropTypes.func.isRequired,
    onCloseCards: PropTypes.func.isRequired,
    onDrag: PropTypes.func,
    onEndDrag: PropTypes.func,
    onNextStep: PropTypes.func.isRequired,
    onPrevStep: PropTypes.func.isRequired,
    onShowAll: PropTypes.func,
    onShrinkExpandCards: PropTypes.func.isRequired,
    onStartDrag: PropTypes.func,
    showVideos: PropTypes.bool,
    step: PropTypes.number.isRequired,
    x: PropTypes.number,
    y: PropTypes.number
};

Cards.defaultProps = {
    showVideos: true
};

export {
    Cards as default,
    // Others exported for testability
    ImageStep,
    VideoStep
};
