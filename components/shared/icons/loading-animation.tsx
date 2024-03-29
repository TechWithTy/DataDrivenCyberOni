import styles from "./loading-animation.module.css";

function LoadingAnimation() {
    return (

        <>
            <div className="w-96 h-36">
                <svg className={styles.loading} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 307.7 97.3" enableBackground="new 0 0 307.7 97.3" xmlSpace="preserve">
                    <circle className={styles.circle} fill="none" stroke="#8e44ad" strokeWidth="7" strokeMiterlimit="10" strokeLinecap="round" cx="74.6" cy="47" r="18.5" />
                    <g>
                        <path className={styles.one} d="M50.4,58.9v9.4H20.6V26.4h10v32.4H50.4z" />
                        <path className={styles.two} d="M127.4,61.7h-16.5l-2.4,6.6H97.7l16.7-41.8h9.5l16.7,41.8h-10.8L127.4,61.7z M124.2,52.9l-3-8.1c-0.9-2.4-2-6.2-2-6.2h-0.1
                        c-0.1,0-1.1,3.8-2,6.2l-3,8.1H124.2z"/>
                        <path className={styles.three} d="M162.4,26.4c11.9,0,21.6,8.5,21.6,21.1s-9.7,20.7-21.6,20.7h-18.3V26.4H162.4z M162.4,58.9c6,0,11.2-4.2,11.2-11.3
                        c0-7.2-5.2-11.7-11.2-11.7h-8.2v23.1H162.4z"/>
                        <path className={styles.four} d="M188.2,68.2V26.4h10v41.8H188.2z" />
                        <path className={styles.five} d="M240.9,26.4v41.8h-9.4l-8.5-11.6c-3.8-5.3-9.4-13.2-9.5-13.2h-0.1c-0.1,0,0.1,6.4,0.1,15.6v9.3h-10V26.4h9.4l8.9,11.9
                        c2.7,3.6,9.1,12.6,9.1,12.6h0.1c0.1,0-0.1-7.4-0.1-15v-9.6H240.9z"/>
                        <path className={styles.six} d="M278.1,64.8c-2.4,2.6-7.2,4.2-11.3,4.2c-12,0-21.7-9.1-21.7-21.7c0-12.6,9.7-21.7,21.7-21.7c8.1,0,15.2,4.3,19,11.1
                        l-10.2,2.7c-2-2.4-5.5-3.9-8.8-3.9c-6.9,0-11.2,5-11.2,11.8c0,7.3,5,11.9,11.8,11.9c6.7,0,9.6-3.5,10.8-6.6v-0.1h-11v-8.1h19.5
                        v23.7h-8.6C278.1,65.5,278.2,64.9,278.1,64.8L278.1,64.8z"/>
                    </g>
                </svg>
            </div>


        </>);
}

export default LoadingAnimation;