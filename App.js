import React, { useState, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./src/store/index";
import AppNavigator from "./src/navigation/AppNavigator";
import {
  initSessionTable,
  saveActiveSession,
  clearActiveSession,
} from "./src/database/db";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "./src/styles/commonStyles";
import { auth, database } from "./src/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue, off } from "firebase/database";
import { setTasks } from "./src/store/tasksSlice";
import { NavigationContainer } from "@react-navigation/native";

function AppContent() {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthDetermined, setIsAuthDetermined] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    let authUnsubscribe;
    let tasksDbRef;
    let tasksListener;

    const prepareAppAndAuth = async () => {
      try {
        await initSessionTable();

        authUnsubscribe = onAuthStateChanged(auth, async (user) => {
          setCurrentUserId(user ? user.uid : null);

          if (user) {
            setIsAuthenticated(true);
            await saveActiveSession(user.uid);

            if (tasksListener) off(tasksDbRef, "value", tasksListener);

            tasksDbRef = ref(database, `tasks/${user.uid}`);
            tasksListener = onValue(
              tasksDbRef,
              (snapshot) => {
                const data = snapshot.val();
                const loadedTasks = data
                  ? Object.keys(data).map((key) => ({
                      id: key,
                      ...data[key],
                    }))
                  : [];

                dispatch(setTasks(loadedTasks));
              },
              (error) => {
                dispatch(setTasks([]));
              }
            );
          } else {
            setIsAuthenticated(false);
            await clearActiveSession();
            dispatch(setTasks([]));

            if (tasksListener && tasksDbRef) {
              off(tasksDbRef, "value", tasksListener);
              tasksListener = null;
              tasksDbRef = null;
            }
          }

          if (!isAuthDetermined) {
            setIsAuthDetermined(true);
          }
        });
      } catch (error) {
        setIsAuthenticated(false);
        setIsAuthDetermined(true);
      }
    };

    prepareAppAndAuth();

    return () => {
      if (authUnsubscribe) {
        authUnsubscribe();
      }

      if (tasksListener && tasksDbRef) {
        off(tasksDbRef, "value", tasksListener);
      }
    };
  }, [dispatch, isAuthDetermined]);

  if (!isAuthDetermined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator isAuthenticated={isAuthenticated} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
});
