
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import outletService from "../../services/outletService";
import { getErrorMessage } from "../../utils/api";

import Loader from "../../components/Common/Loader";
import useLocation from "../../context/useLocation";

import FormPage from "./OutletForm";
import LocationPage from "./LocationPage";

import { useAuth } from "../../context/useAuth";

const initialForm = {
  outletName: "",
  description: "",
  cuisine: "",
  foodType: "both",
  openingTime: "09:00",
  closingTime: "18:00",
  isOpen: true,
  status: "active",
  image: null,
};

const initialLocation = {
  latitude: null,
  longitude: null,
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

const initialManager = {
  name: "",
  email: "",
  password: "",
  phone: "",
};

const CreateOutlet = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const { useCurrentLocation } = useLocation();

  const [form, setForm] = useState(initialForm);
  const [locationForm, setLocationForm] = useState(initialLocation);
  const [managerForm, setManagerForm] = useState(initialManager);

  const [showManagerForm, setShowManagerForm] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showLocationForm, setShowLocationForm] = useState(false);

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));
  const [locationLoading, setLocationLoading] = useState(false);

  // Handle outlet form changes
  const change = (e) => {
    const { name, value, type, checked, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
            ? files[0]
            : value,
    }));
  };

  // Handle location form changes
  const locationChange = (e) => {
    const { name, value } = e.target;

    setLocationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle manager form changes
  const managerChange = (e) => {
    const { name, value } = e.target;

    setManagerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch outlet when editing
  useEffect(() => {
    const fetchOutlet = async () => {
      try {
        if (!id) return;

        const response = await outletService.getOne(id);
        const outlet = response.outlet;

        setForm((prev) => ({
            ...prev,
            ...outlet,
            cuisine: (outlet.cuisine || []).join(", "),
            image: null,
            outletName: outlet.name,
        }));

        setLocationForm((prev) => ({
          ...prev,
          latitude: outlet.latitude ?? null,
          longitude: outlet.longitude ?? null,
          addressLine1: outlet.address || "",
          addressLine2: outlet.area || "",
          city: outlet.city || "",
          state: outlet.state || "",
          pincode: outlet.pincode || "",
        }));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchOutlet();
  }, [id]);

  // Get address using coordinates
  const getAddressFromCoordinates = async (latitude, longitude) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );

    if (!response.ok) {
      throw new Error("Unable to find address for this location");
    }

    return await response.json();
  };

  // Apply selected location
  const applyLocation = async ({ latitude, longitude }) => {
    try {
      setError("");
      setLocationLoading(true);

      setLocationForm((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));

      const data = await getAddressFromCoordinates(
        latitude,
        longitude
      );

      const address = data.address || {};

      setLocationForm((prev) => ({
        ...prev,
        latitude,
        longitude,
        addressLine1: [
          address.house_number,
          address.road,
        ]
          .filter(Boolean)
          .join(", "),
        addressLine2: [
          address.suburb,
          address.neighbourhood,
          address.residential,
        ]
          .filter(Boolean)
          .join(", "),
        city:
          address.city ||
          address.town ||
          address.municipality ||
          "",
        state: address.state || "",
        pincode: address.postcode || "",
      }));
    } catch (err) {
      console.error(err);

      setError(
        "Location selected, but address details could not be loaded. You can enter the address manually."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  // Use current location
  const handleUseCurrentLocation = async () => {
    try {
      setError("");

      const currentLocation = await useCurrentLocation();

      await applyLocation(currentLocation);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to get current location. Please allow location access."
      );
    }
  };

  // Handle map location selection
  const handleMapLocation = async (location) => {
    await applyLocation(location);
  };

  // Outlet form -> Location form
  const outletNext = (e) => {
    e.preventDefault();

    setShowForm(false);
    setShowLocationForm(true);
    setShowManagerForm(false);
  };

  // Location form -> Manager form
  const locationNext = (e) => {
    e.preventDefault();

    setShowForm(false);
    setShowLocationForm(false);
    setShowManagerForm(true);
  };

  // Location form -> Outlet form
  const locationBack = (e) => {
    e.preventDefault();

    setShowForm(true);
    setShowLocationForm(false);
    setShowManagerForm(false);
  };

  // Manager form -> Location form
  const managerBack = () => {
    setShowForm(false);
    setShowLocationForm(true);
    setShowManagerForm(false);
  };

  // Submit outlet data
  const sendData = async (e) => {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      const city = [
        locationForm.city,
        locationForm.state,
      ]
        .filter(Boolean)
        .join(", ");

      const payload = new FormData();

      // Location and manager details are required only while creating
      if (!id) {
        payload.append("latitude", locationForm.latitude ?? "");
        payload.append("longitude", locationForm.longitude ?? "");
        payload.append("pincode", locationForm.pincode);
        payload.append("address", locationForm.addressLine1);
        payload.append("area", locationForm.addressLine2);
        payload.append("city", city);

        payload.append("name", managerForm.name);
        payload.append("email", managerForm.email);
        payload.append("phone", managerForm.phone);
        payload.append("password", managerForm.password);
      }

      payload.append("outletName", form.outletName);
      payload.append("description", form.description);
      payload.append("foodType", form.foodType);
      payload.append("openingTime", form.openingTime);
      payload.append("closingTime", form.closingTime);
      payload.append("isOpen", form.isOpen);
      payload.append("status", form.status);

      const cuisines = form.cuisine
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

      cuisines.forEach((cuisine) => {
        payload.append("cuisine", cuisine);
      });

      if (form.image) {
        payload.append("image", form.image);
      }

      if (id) {
        await outletService.update(id, payload);
      } else {
        await outletService.create(payload);
      }

      toast.success(
        id
          ? "Outlet updated successfully!"
          : "Outlet created successfully!"
      );

      navigate("/outlets");
    } catch (err) {
      const message = getErrorMessage(err);

      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <div className="content-header">
        <div>
          <p className="content-eyebrow">
            Outlet Management
          </p>

          <h1 className="content-title">
            {id ? "Update Outlet" : "Create Outlet"}
          </h1>

          <p className="content-description">
            {id
              ? "Update your outlet information and location."
              : "Configure your business, location and manager details."}
          </p>
        </div>
      </div>

      {error && (
        <div className="message-error">
          {error}
        </div>
      )}

      <div className="content-body">
        {showForm && (
          <FormPage
            id={id}
            form={form}
            busy={busy}
            outletNext={outletNext}
            change={change}
            sendData={sendData}
            isManagerAuthenticated={false}
          />
        )}

        {showLocationForm && (
          <LocationPage
            id={id}
            locationForm={locationForm}
            locationChange={locationChange}
            handleMapLocation={handleMapLocation}
            handleUseCurrentLocation={handleUseCurrentLocation}
            locationLoading={locationLoading}
            locationNext={locationNext}
            locationBack={locationBack}
          />
        )}

        {showManagerForm && !id && (
          <ManagerPage
            managerForm={managerForm}
            sendData={sendData}
            managerchange={managerChange}
            managerBack={managerBack}
            busy={busy}
          />
        )}
      </div>
    </div>
  );
};

export default CreateOutlet;

// Manager creation form
export function ManagerPage({
  managerForm,
  managerchange,
  sendData,
  busy,
  managerBack,
}) {
  return (
    <div className="wizard-section">
      <div className="wizard-heading">
        <h2 className="section-title">
          Manager Details
        </h2>

        <p className="content-description">
          Create the account that will manage this outlet.
        </p>
      </div>

      <form
        className="form-container"
        onSubmit={sendData}
      >
        <div className="form-grid">
          <label className="form-field">
            Name

            <input
              className="form-input"
              type="text"
              name="name"
              required
              value={managerForm.name}
              onChange={managerchange}
              placeholder="Manager Name"
            />
          </label>

          <label className="form-field">
            Email

            <input
              className="form-input"
              type="email"
              name="email"
              required
              value={managerForm.email}
              onChange={managerchange}
              placeholder="Manager Email"
            />
          </label>

          <label className="form-field">
            Phone

            <input
              className="form-input"
              type="tel"
              name="phone"
              required
              value={managerForm.phone}
              onChange={managerchange}
              placeholder="Contact Number"
            />
          </label>

          <label className="form-field">
            Password

            <input
              className="form-input"
              type="password"
              name="password"
              required
              value={managerForm.password}
              onChange={managerchange}
              placeholder="Password"
            />
          </label>
        </div>

        <div className="form-actions wizard-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={managerBack}
          >
            Back
          </button>

          <button
            className="primary-button"
            type="submit"
            disabled={busy}
          >
            {busy ? "Creating..." : "Create Outlet"}
          </button>
        </div>
      </form>
    </div>
  );
}
