const ErrorPage = () => {

    return (
        <div className="w-screen h-screen bg-[#080710] flex justify-center items-center">
            <div className="w-11/12 text-white font-poppins flex flex-col gap-5 justify-center items-center">
                <h2 className="text-8xl font-semibold">404</h2>
                <p className="text-xl">Page not found!</p>
            </div>
        </div>
    );
}

export default ErrorPage;