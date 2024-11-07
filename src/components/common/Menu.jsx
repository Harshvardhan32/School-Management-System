import { Link } from 'react-router-dom';
import menuData from '../../data/MenuData';
import { role } from '../../data/data'

const Menu = () => {

    return (
        <div className='mt-4 text-sm'>
            {
                menuData?.map((data) => (
                    <div className='flex flex-col gap-2' key={data?.title}>
                        <span className='hidden lg:block text-gray-400 font-light my-4'>{data.title}</span>
                        {
                            data.items.map((item) => {
                                if (item.visible.includes(role)) {
                                    return (
                                        (
                                            <Link
                                                to={item.href}
                                                key={item.label}
                                                title={item.label}
                                                className='flex flex-row items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-[6px] hover:bg-emerald-100'
                                            >
                                                <img src={item.icon} alt="" className='w-[20px] h-[20px]' />
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
    );

}

export default Menu;