import Header from '../../Header/Header'

export default function TopSlidePage({ isShowTop }) {
    console.log(isShowTop)
    return(
        <div>
            {isShowTop && <Header />}
        </div>
    )
}