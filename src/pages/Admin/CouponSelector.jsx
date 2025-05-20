import { useState, useEffect, useRef } from 'react';
import { Search, X, Check } from 'lucide-react';

export default function CouponSelector({ coupons = [], formData, setFormData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCoupons, setFilteredCoupons] = useState(coupons);
  const [selectedCoupon, setSelectedCoupon] = useState(formData.coupon || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setFilteredCoupons(
      coupons.filter(coupon => 
        coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${coupon.percentage}`.includes(searchTerm)
      )
    );
  }, [searchTerm, coupons]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    // Add event listener when dropdown is open
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSelectCoupon = (couponId) => {
    if (selectedCoupon === couponId) {
      // Deselect if already selected
      setSelectedCoupon('');
      setFormData({ ...formData, coupon: '' });
    } else {
      // Select new coupon
      setSelectedCoupon(couponId);
      setFormData({ ...formData, coupon: couponId });
    }
    setIsDropdownOpen(false);
  };

  const selectedCouponData = coupons.find(c => c._id === selectedCoupon);

  return (
    <div className="w-full mb-6 relative" ref={dropdownRef}>
      <label className="block text-sm font-medium mb-2">Coupons (Optional)</label>
      
      {/* Selected coupon display / dropdown trigger */}
      <div 
        className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer bg-white darkthemeinput"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedCouponData ? (
          <div className="flex justify-between items-center w-full">
            <div>
              <span className="font-medium">{selectedCouponData.name}</span>
              <span className="ml-2 text-green-600">{selectedCouponData.percentage}% off</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleSelectCoupon(selectedCoupon);
              }}
              className="text-gray-500 hover:text-red-500 p-1"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="text-gray-500">Select a coupon</div>
        )}
      </div>
      
      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white darkthemeinput border border-gray-300 rounded-lg shadow-lg">
          {/* Search Bar */}
          <div className="relative p-2 border-b border-gray-200">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-8 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 darkthemeinput"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-2 p-2 bg-gray-100 border-b border-gray-200 font-medium darkthemeinput">
            <div>Coupon Name</div>
            <div>Discount</div>
            <div className="text-right">Action</div>
          </div>
          
          {/* Coupons List - Static Height with 3 rows visible */}
          <div className="max-h-36 overflow-y-auto darkthemeinput">
            {filteredCoupons.length > 0 ? (
              filteredCoupons.map((coupon) => (
                <div 
                  key={coupon._id}
                  className={`grid grid-cols-3 gap-2 p-2 darkthemeinput items-center border-b border-gray-200  ${
                    selectedCoupon === coupon._id ? 'bg-blue-50 darkthemeinput' : ''
                  }`}
                >
                  <div className="font-medium ">{coupon.name}</div>
                  <div className="text-green-600">{coupon.percentage}% off</div>
                  <div className="text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCoupon(coupon._id);
                      }}
                      className={`px-3 py-1 rounded darkthemeinput ${
                        selectedCoupon === coupon._id
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-200 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      {selectedCoupon === coupon._id ? <span className="flex items-center "><Check size={14} className="mr-1" /> Selected</span> : 'Select'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No coupons found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}