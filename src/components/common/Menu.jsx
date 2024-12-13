import { Link, useLocation } from 'react-router-dom';
import menuData from '../../data/MenuData';
import { useState } from 'react';
import LogoutModal from '../LogoutModal';
import { useSelector } from 'react-redux';

const Menu = () => {

    const [logoutModal, setLogoutModal] = useState(false);
    const { user } = useSelector((state) => state?.profile);
    const role = user?.userId.role;
    const location = useLocation();
    const path = location.pathname.split('/').at(-1);

    return (
        <>
            <div className='mt-4 text-sm'>
                {
                    menuData?.map((data) => (
                        <div className='flex flex-col gap-2' key={data?.title}>
                            <span className='hidden lg:block text-gray-400 font-light my-4'>{data.title}</span>
                            {
                                data?.items?.map((item) => {
                                    if (item.visible.includes(role)) {
                                        return (
                                            (
                                                <Link
                                                    to={item.label !== 'Logout' && item.href}
                                                    key={item.label}
                                                    title={item.label}
                                                    onClick={item.label === 'Logout' ? () => setLogoutModal(true) : undefined}
                                                    className={`flex flex-row items-center justify-center lg:justify-start gap-4 text-gray-500 dark:text-gray-200 py-2 md:px-2 rounded-[6px] hover:bg-emerald-100 dark:hover:bg-gray-700 ${path === item.href.split('/').at(-1) && 'bg-emerald-100 dark:bg-gray-700'}`}
                                                >
                                                    <img src={item.icon} alt="" className="w-[20px] h-[20px]" />
                                                    <span className='hidden lg:block'>{item.label}</span>
                                                </Link>
                                            )
                                        )
                                    }
                                })
                            }
                        </div>
                    ))
                }
            </div>
            {logoutModal && <LogoutModal setLogoutModal={setLogoutModal} />}
        </>
    );

}

export default Menu;