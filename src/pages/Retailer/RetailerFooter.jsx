import React from 'react'

const RetailerFooter = () => {
    return (
        <footer className="dark:bg-gray-800 bg-white textcolor p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <h4 className="font-bold text-lg">Get to Know Us</h4>
                    <ul>
                        OSIYA GROUP is an Indian Business House setting new standards in
                        Dot LED, Video Wall, Cinema LED, Digital Signage, Electronics
                        Distribution CWH , Warehousing and C&F Businesses.
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg">Connect with Us</h4>
                    <ul>
                        <li>Facebook</li>
                        <li>Twitter</li>
                        <li>Instagram</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-2">Make Money with Us</h4>
                    <ul className="space-y-1 text-sm">
                        <li>Sell on website</li>
                        <li>Sell under website Accelerator</li>
                        <li>Protect and Build Your Brand</li>
                        <li>website Global Selling</li>
                        <li>Supply to website</li>
                        <li>Become an Affiliate</li>
                        <li>Fulfillment by website</li>
                        <li>Advertise Your Products</li>
                        <li>website Pay on Merchants</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-2">Let Us Help You</h4>
                    <ul className="space-y-1 text-sm">
                        <li>Your Account</li>
                        <li>Returns Centre</li>
                        <li>Recalls and Product Safety Alerts</li>
                        <li>100% Purchase Protection</li>
                        <li>website App Download</li>
                        <li>Help</li>
                    </ul>
                </div>
            </div>
            <div className="mt-8 border-t-2 border-gray-700"></div>
            <div className="text-center dark:text-gray-400 text-black mt-4">
                <p>&copy; 2024 E-Com. All Rights Reserved.</p>
                <p>
                    Follow Us:{" "}
                    <a href="#" className="text-customPurple hover:underline">
                        Facebook
                    </a>
                    ,{" "}
                    <a href="#" className="text-customPurple hover:underline">
                        Instagram
                    </a>
                    ,{" "}
                    <a href="#" className="text-customPurple hover:underline">
                        Twitter
                    </a>
                </p>
            </div>
        </footer>
    )
}

export default RetailerFooter